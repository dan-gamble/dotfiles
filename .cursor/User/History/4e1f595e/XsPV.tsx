import { getGlobalProductGroupSelectedItemsFromShopify } from "~/models/GlobalProductGroup.server";
import type { Route } from "./+types/$id.selected-items";
import { data } from "react-router";

export async function loader({ context, params, request }: Route.LoaderArgs) {
	const { admin } = await context.shopify.authenticate(request);

	const globalProductGroup = await getGlobalProductGroupByIdFromTheDatabase({
		db: context.db,
		id: params.id,
	});

	if (!globalProductGroup) {
		return data(
			{
				selectedItems: [],
			},
			{
				status: 404,
				statusText: "Unable to find product group",
			},
		);
	}

	const selectedItems = await getGlobalProductGroupSelectedItemsFromShopify({
		data: globalProductGroup,
		graphql: admin.graphql,
	});

	return {
		selectedItems,
	};
}
