import { parseGid } from "@shopify/admin-graphql-api-utilities";
import {
	type SQL,
	and,
	asc,
	desc,
	eq,
	inArray,
	isNull,
	like,
	or,
} from "drizzle-orm";
import type { SelectedItem } from "~/context/ProductGroupItemsContext";
import { globalProductGroups } from "~/database/schema/global-product-groups";
import { prices } from "~/database/schema/prices";
import { productGroupItems } from "~/database/schema/product-group-items";
import { productGroups } from "~/database/schema/product-groups";
import type { getSellingPlanGroupsQueryVariables } from "~/routes/app/product-groups/utils";
import { makeRequest } from "~/server/utils/graphql.server";
import type { CurrencyCode } from "~/types/admin.types";
import { formatDatabaseDate } from "~/utils/db";
import type { GlobalProductGroupData } from "~/validators/GlobalProductGroupValidator";
import type { Database } from "../../load-context/database";
import type { ShopifyGraphQLClient } from "../../load-context/shopify";
import {
	priceRowsToValidatorStructure,
	validatorStructureToPriceRows,
} from "./Price.server";

type DatabaseData = Awaited<
	ReturnType<typeof fetchGlobalProductGroupsFromDatabase>
>;

export async function getGlobalProductGroupsCount({ db }: { db: Database }) {
	return db.$count(globalProductGroups);
}

export async function getGlobalProductGroups({
	db,
	sortKey,
	reverse,
	page,
	perPage,
	query,
}: ReturnType<typeof getSellingPlanGroupsQueryVariables> & {
	db: Database;
}) {
	const data = await fetchGlobalProductGroupsFromDatabase(db, {
		sortKey,
		reverse,
		page,
		perPage,
		query,
	});
	if (data.length === 0) return [];

	return groupProductGroupsById(data)
		.map((datum) => transformDatabaseData(datum))
		.filter(Boolean);
}

export async function getGlobalProductGroupByIdFromTheDatabase({
	db,
	id,
}: {
	db: Database;
	id: string;
}) {
	return await getGlobalProductGroupFromTheDatabase(db, id);
}

export async function getGlobalProductGroupSelectedItemsFromShopify({
	data,
	graphql,
}: {
	data: GlobalProductGroupData;
	graphql: ShopifyGraphQLClient;
}) {
	const productsResponse = await makeRequest(
		graphql,
		`#graphql
		query GlobalProductGroupProducts ($count: Int!, $query: String!) {
			products(first: $count, query: $query) {
				nodes {
					id
					title
					media (first: 1, query: "media_type:IMAGE") {
						nodes {
							preview {
								image {
									url(transform: {maxWidth: 60, maxHeight: 60, scale: 2})
								}
							}
						}
					}
					variants(first: 100) {
						nodes {
							id
							title
						}
					}
				}
			}
		}
	`,
		{
			variables: {
				count: data.productGroup.productGroupItems.length,
				query: data.productGroup.productGroupItems
					.map((item) => `(id:${parseGid(item.productId)})`)
					.join(" OR "),
			},
		},
	);

	const nodes = productsResponse.data?.products?.nodes;
	if (!nodes) return [];

	const selectedItems: SelectedItem[] = data.productGroup.productGroupItems.map(
		(item) => {
			const productFromShopify = nodes.find(
				(node) => node.id === item.productId,
			);
			if (!productFromShopify)
				throw new Error(
					`Unable to determine selected items because ${item.productId} isn't in the shopify data`,
				);

			const variant = productFromShopify.variants.nodes.find(
				(variant) => variant.id === item.variantId,
			);
			if (!variant)
				throw new Error(
					`Unable to determine selected items because ${item.variantId} isn't in the shopify data`,
				);

			return {
				productId: item.productId,
				variantId: item.variantId,
				title: productFromShopify.title,
				variantTitle: variant.title,
				imageUrl: productFromShopify.media.nodes?.[0]?.preview?.image?.url,
			};
		},
	);

	return selectedItems;
}

export async function getGlobalProductGroupById({
	db,
	graphql,
	id,
}: { db: Database; graphql: ShopifyGraphQLClient; id: string }): Promise<{
	databaseData: GlobalProductGroupData;
	selectedItems: SelectedItem[];
} | null> {
	const databaseData = await getGlobalProductGroupFromTheDatabase(db, id);
	if (!databaseData) return null;

	return {
		databaseData,
		selectedItems: await getGlobalProductGroupSelectedItemsFromShopify({
			data: databaseData,
			graphql,
		}),
	};
}

export async function createGlobalProductGroup({
	data,
	db,
}: {
	data: GlobalProductGroupData;
	db: Database;
}) {
	await db.batch([
		db.insert(productGroups).values({
			id: data.productGroup.id,
			title: data.productGroup.title,
			minimumNumberOfChoices: data.productGroup.minimumNumberOfChoices,
			maximumNumberOfChoices: data.productGroup.maximumNumberOfChoices,
		}),
		...validatorStructureToPriceRows({
			data: data.productGroup.prices,
			db,
			priceableId: data.productGroup.id,
			priceableType: "ProductGroup",
		}),
		db.insert(globalProductGroups).values({
			id: data.id,
			shopId: data.shopId,
			title: data.title,
			productGroupId: data.productGroup.id,
		}),
		...data.productGroup.productGroupItems.flatMap((item) => {
			return [
				db.insert(productGroupItems).values({
					id: item.id,
					productId: item.productId,
					variantId: item.variantId,
					productGroupId: data.productGroup.id,
				}),
				...validatorStructureToPriceRows({
					data: item.prices,
					db,
					priceableId: item.id,
					priceableType: "ProductGroupItem",
				}),
			];
		}),
	]);

	return data;
}

export async function updateGlobalProductGroup({
	data,
	db,
	id,
}: {
	data: GlobalProductGroupData;
	db: Database;
	id: string;
}) {
	const existingItems = await db
		.select()
		.from(productGroupItems)
		.where(eq(productGroupItems.productGroupId, data.productGroup.id));

	const existingItemIds = new Set(existingItems.map((item) => item.id));
	const newItemIds = new Set(
		data.productGroup.productGroupItems.map((item) => item.id),
	);

	const itemsToDelete = existingItems.filter(
		(item) => !newItemIds.has(item.id),
	);
	const itemsToAdd = data.productGroup.productGroupItems.filter(
		(item) => !existingItemIds.has(item.id),
	);
	const itemsToUpdate = data.productGroup.productGroupItems.filter((item) =>
		existingItemIds.has(item.id),
	);

	const operations: Parameters<typeof db.batch>[0] = [
		db
			.update(globalProductGroups)
			.set({
				title: data.title,
			})
			.where(eq(globalProductGroups.id, id)),
		db
			.update(productGroups)
			.set({
				title: data.productGroup.title,
				minimumNumberOfChoices: data.productGroup.minimumNumberOfChoices,
				maximumNumberOfChoices: data.productGroup.maximumNumberOfChoices,
			})
			.where(eq(productGroups.id, data.productGroup.id)),
		...validatorStructureToPriceRows({
			data: data.productGroup.prices,
			db,
			priceableId: data.productGroup.id,
			priceableType: "ProductGroup",
		}),
		...itemsToDelete.flatMap((item) => [
			db.delete(productGroupItems).where(eq(productGroupItems.id, item.id)),
			db
				.delete(prices)
				.where(
					and(
						eq(prices.priceableId, item.id),
						eq(prices.priceableType, "ProductGroupItem"),
					),
				),
		]),

		...itemsToAdd.flatMap((item) => [
			db.insert(productGroupItems).values({
				id: item.id,
				productId: item.productId,
				variantId: item.variantId,
				productGroupId: data.productGroup.id,
			}),
			...validatorStructureToPriceRows({
				data: item.prices,
				db,
				priceableId: item.id,
				priceableType: "ProductGroupItem",
			}),
		]),

		...itemsToUpdate.flatMap((item) => [
			db
				.update(productGroupItems)
				.set({
					productId: item.productId,
					variantId: item.variantId,
				})
				.where(eq(productGroupItems.id, item.id)),
			...validatorStructureToPriceRows({
				data: item.prices,
				db,
				priceableId: item.id,
				priceableType: "ProductGroupItem",
			}),
		]),
	];

	await db.batch(operations);

	return data;
}

export async function deleteGlobalProductGroups({
	db,
	ids,
}: { db: Database; ids: string[] }) {
	const now = new Date();

	return db
		.update(globalProductGroups)
		.set({
			deletedAt: formatDatabaseDate(now),
		})
		.where(inArray(globalProductGroups.id, ids))
		.returning();
}

async function getGlobalProductGroupFromTheDatabase(db: Database, id: string) {
	return transformDatabaseData(
		await fetchGlobalProductGroupsFromDatabase(db, { id }),
	);
}

async function fetchGlobalProductGroupsFromDatabase(
	db: Database,
	{
		id,
		sortKey,
		reverse,
		page,
		perPage,
		query,
	}: Partial<ReturnType<typeof getSellingPlanGroupsQueryVariables>> & {
		id?: string;
	} = {},
) {
	const filters: SQL[] = [];
	filters.push(isNull(globalProductGroups.deletedAt));

	let subquery = db
		.select({
			id: globalProductGroups.id,
		})
		.from(globalProductGroups)
		.$dynamic();

	if (sortKey) {
		const direction = reverse ? asc : desc;

		switch (sortKey) {
			case "TITLE":
				subquery = subquery.orderBy(direction(globalProductGroups.title));
				break;
			case "CREATED_AT":
				subquery = subquery.orderBy(direction(globalProductGroups.createdAt));
				break;
			case "UPDATED_AT":
				subquery = subquery.orderBy(direction(globalProductGroups.updatedAt));
				break;
		}
	}

	if (query) {
		filters.push(like(globalProductGroups.title, `%${query}%`));
	}

	if (perPage) {
		subquery = subquery.limit(perPage);
	}

	if (page && perPage) {
		subquery = subquery.offset((page - 1) * perPage);
	}

	subquery = subquery.where(and(...filters));

	if (id) {
		subquery = subquery.where(eq(globalProductGroups.id, id));
	}

	return db
		.selectDistinct({
			globalProductGroup: globalProductGroups,
			productGroup: productGroups,
			items: productGroupItems,
			prices: prices,
		})
		.from(globalProductGroups)
		.innerJoin(
			productGroups,
			eq(productGroups.id, globalProductGroups.productGroupId),
		)
		.leftJoin(
			productGroupItems,
			and(
				eq(
					productGroupItems.productGroupId,
					globalProductGroups.productGroupId,
				),
				isNull(productGroupItems.deletedAt),
			),
		)
		.leftJoin(
			prices,
			or(
				and(
					eq(prices.priceableId, globalProductGroups.productGroupId),
					eq(prices.priceableType, "ProductGroup"),
					isNull(prices.deletedAt),
				),
				and(
					eq(prices.priceableId, productGroupItems.id),
					eq(prices.priceableType, "ProductGroupItem"),
					isNull(prices.deletedAt),
				),
			),
		)
		.where(inArray(globalProductGroups.id, subquery))
		.orderBy(
			globalProductGroups.createdAt,
			productGroups.createdAt,
			productGroupItems.createdAt,
			prices.createdAt,
		);
}

function transformDatabaseData(data: DatabaseData) {
	if (!data.length) {
		return null;
	}

	const firstRow = data[0];

	if (!firstRow.globalProductGroup || !firstRow.productGroup) {
		return null;
	}

	const uniqueItems = Array.from(
		new Map(
			data
				.map((row) => row.items)
				.filter(
					(item): item is typeof productGroupItems.$inferSelect =>
						item !== null && typeof item === "object" && "id" in item,
				)
				.map((item) => [item.id, item]),
		).values(),
	);
	const priceRows = data
		.map((row) => row.prices)
		.filter(
			(item): item is typeof prices.$inferSelect =>
				item !== null && typeof item === "object" && "id" in item,
		);

	const productGroupPrices = priceRows.filter(
		(priceRow) =>
			priceRow.priceableId === firstRow.productGroup.id &&
			priceRow.priceableType === "ProductGroup",
	);
	if (productGroupPrices.length <= 0)
		throw new Error(`Unable to find price for ${firstRow.productGroup.id}`);

	const globalProductGroup = {
		...firstRow.globalProductGroup,
		productGroup: {
			...firstRow.productGroup,
			prices: productGroupPrices,
			items: uniqueItems.map((item) => {
				const itemPrices = priceRows.filter(
					(priceRow) =>
						priceRow.priceableId === item.id &&
						priceRow.priceableType === "ProductGroupItem",
				);
				if (itemPrices.length <= 0)
					throw new Error(`Unable to find price for ${item.id}`);

				return {
					...item,
					prices: itemPrices,
				};
			}),
		},
	};

	return {
		id: globalProductGroup.id,
		title: globalProductGroup.title,
		shopId: globalProductGroup.shopId,
		productGroupId: globalProductGroup.productGroupId,
		productGroup: {
			id: globalProductGroup.productGroup.id,
			title: globalProductGroup.productGroup.title,
			prices: priceRowsToValidatorStructure(
				globalProductGroup.productGroup.prices,
				globalProductGroup.productGroup.id,
			),
			minimumNumberOfChoices:
				globalProductGroup.productGroup.minimumNumberOfChoices,
			maximumNumberOfChoices:
				globalProductGroup.productGroup.maximumNumberOfChoices,
			productGroupItems: globalProductGroup.productGroup.items.map((item) => {
				return {
					id: item.id,
					productId: item.productId,
					variantId: item.variantId,
					productGroupId: item.productGroupId,
					prices: priceRowsToValidatorStructure(item.prices, item.id),
				};
			}),
		},
		updatedAt: globalProductGroup.updatedAt,
	} as const satisfies GlobalProductGroupData;
}

function groupProductGroupsById(data: DatabaseData): DatabaseData[] {
	const productGroups = data.reduce<Map<string, DatabaseData>>(
		(groups, datum) => {
			const group = groups.get(datum.globalProductGroup.id);
			if (!group) {
				groups.set(datum.globalProductGroup.id, [datum]);

				return groups;
			}

			group.push(datum);

			return groups;
		},
		new Map<string, DatabaseData>(),
	);

	return Array.from(productGroups.values());
}
