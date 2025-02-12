import {
	getGlobalProductGroupByIdFromTheDatabase,
	getGlobalProductGroupSelectedItemsFromShopify,
} from "~/models/GlobalProductGroup.server";
import type { Route } from "./+types/$id.selected-items";
import { getGlobalProductGroupIdFromProductGroupId } from "~/models/ProductGroup.server";
import { queryOptions } from "@tanstack/react-query";
import type { Database } from "../../../../load-context/database";
import type { ShopifyGraphQLClient } from "../../../../load-context/shopify";
import { queryKey } from "~/queries/product-groups-selected-items";

export const serverQuery = ({
	id,
	db,
	graphql,
}: {
	id: string;
	db: Database;
	graphql: ShopifyGraphQLClient;
}) =>
	queryOptions({
		queryKey: queryKey(id),
		queryFn: async () => {
			const globalProductGroupId =
				await getGlobalProductGroupIdFromProductGroupId({
					db: db,
					id,
				});

			if (!globalProductGroupId) {
				return {
					selectedItems: [],
				};
			}

			const globalProductGroup = await getGlobalProductGroupByIdFromTheDatabase(
				{
					db: db,
					id: globalProductGroupId,
				},
			);

			if (!globalProductGroup) {
				return {
					selectedItems: [],
				};
			}

			const selectedItems = await getGlobalProductGroupSelectedItemsFromShopify(
				{
					data: globalProductGroup,
					graphql,
				},
			);

			return {
				selectedItems,
			};
		},
	});

export const clientQuery = (id: string) =>
	queryOptions({
		queryKey: queryKey(id),
		queryFn: async () => {
			const response = await fetch(`/app/products/${id}/selected-items`);
			if (!response.ok) {
				throw new Error("Failed to fetch selected items");
			}

			return (await response.json()) as Awaited<ReturnType<typeof loader>>;
		},
	});

export async function loader({ context, params, request }: Route.LoaderArgs) {
	const { admin } = await context.shopify.authenticate.admin(request);

	return await context.queryClient.ensureQueryData(
		serverQuery({
			id: params.id,
			db: context.db,
			graphql: admin.graphql,
		}),
	);
}
