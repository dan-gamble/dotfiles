import {
	getGlobalProductGroupByIdFromTheDatabase,
	getGlobalProductGroupSelectedItemsFromShopify,
} from "~/models/GlobalProductGroup.server";
import type { Route } from "./+types/$id.selected-items";

export async function loader({ context, params, request }: Route.LoaderArgs) {
	const { admin } = await context.shopify.authenticate.admin(request);

	console.log(params);

	const globalProductGroup = await getGlobalProductGroupByIdFromTheDatabase({
		db: context.db,
		id: params.id,
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
