import {
	getGlobalProductGroupByIdFromTheDatabase,
	getGlobalProductGroupSelectedItemsFromShopify,
} from "~/models/GlobalProductGroup.server";
import type { Route } from "./+types/$id.selected-items";
import { data } from "react-router";

type SelectedItems = Awaited<
	ReturnType<typeof getGlobalProductGroupSelectedItemsFromShopify>
>;

export async function loader({ context, params, request }: Route.LoaderArgs) {
	const { admin } = await context.shopify.authenticate.admin(request);

	const globalProductGroup = await getGlobalProductGroupByIdFromTheDatabase({
		db: context.db,
		id: params.id,
	});

	if (!globalProductGroup) {
		return {
			selectedItems: [] as SelectedItems,
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
