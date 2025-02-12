import {
	getGlobalProductGroupByIdFromTheDatabase,
	getGlobalProductGroupSelectedItemsFromShopify,
} from "~/models/GlobalProductGroup.server";
import type { Route } from "./+types/$id.selected-items";
import { getGlobalProductGroupIdFromProductGroupId } from "~/models/ProductGroup.server";
import { handleClientLoaderForAsyncFetcher } from "~/hooks/use-async-fetcher";
import { queryOptions } from "@tanstack/react-query";
import { Database } from "../../../../load-context/database";

const query = (id: string) =>
	queryOptions({
		queryKey: ["product-groups", id, "selected-items"],
		queryFn: async (db: Database) => {},
	});

export async function loader({ context, params, request }: Route.LoaderArgs) {
	const { admin } = await context.shopify.authenticate.admin(request);

	const globalProductGroupId = await getGlobalProductGroupIdFromProductGroupId({
		db: context.db,
		id: params.id,
	});

	if (!globalProductGroupId) {
		return {
			selectedItems: [],
		};
	}

	const globalProductGroup = await getGlobalProductGroupByIdFromTheDatabase({
		db: context.db,
		id: globalProductGroupId,
	});

	if (!globalProductGroup) {
		return {
			selectedItems: [],
		};
	}

	const selectedItems = await getGlobalProductGroupSelectedItemsFromShopify({
		data: globalProductGroup,
		graphql: admin.graphql,
	});

	return {
		selectedItems,
	};
}

export const clientLoader = handleClientLoaderForAsyncFetcher;
