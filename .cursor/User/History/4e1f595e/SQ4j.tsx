import {
	getGlobalProductGroupByIdFromTheDatabase,
	getGlobalProductGroupSelectedItemsFromShopify,
} from "~/models/GlobalProductGroup.server";
import type { Route } from "./+types/$id.selected-items";
import { getGlobalProductGroupIdFromProductGroupId } from "~/models/ProductGroup.server";

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

	console.log({ globalProductGroup });

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
