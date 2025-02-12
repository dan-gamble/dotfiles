import { randomUUID } from "node:crypto";
import { validationError } from "@rvf/react-router";
import { data } from "react-router";
import { Form } from "~/components/Form";
import { LocalizedPage } from "~/components/LocalizedPage";
import type { SelectedItem } from "~/context/ProductGroupItemsContext";
import { useToasts } from "~/hooks/use-toasts";
import {
	createGlobalProductGroup,
	getGlobalProductGroupByIdFromTheDatabase,
	getGlobalProductGroupSelectedItemsFromShopify,
	updateGlobalProductGroup,
} from "~/models/GlobalProductGroup.server";
import { createEmptyPrice } from "~/models/Price.server";
import { createEmptyProductGroup } from "~/models/ProductGroup.server";
import { CurrencyCode } from "~/types/admin.types";
import { toast } from "~/utils/helpers/toast";
import {
	type GlobalProductGroupData,
	GlobalProductGroupValidator,
} from "~/validators/GlobalProductGroupValidator";
import type { Route } from "./+types/$id";
import { GlobalProductGroupForm } from "./components/GlobalProductGroupForm";
import { shops } from "~/database/schema/shops";
import { eq } from "drizzle-orm";

export async function loader({
	context,
	params,
	request,
}: Route.LoaderArgs): Promise<{
	globalProductGroup: GlobalProductGroupData;
	selectedItems: Promise<SelectedItem[]>;
}> {
const { session } = await context.shopify.authenticate.admin(request);

const [shop] = await context.db
	.select()
	.from(shops)
	.where(eq(shops.shopDomain, session.shop));

if (params.id === "new") {
	const productGroup = createEmptyProductGroup();
	const globalProductGroupId = randomUUID();

	return {
		globalProductGroup: {
			id: globalProductGroupId,
			title: "",
			shopId: shop.id,
			productGroupId: productGroup.id,
			productGroup: {
				...productGroup,
				prices: {
					[CurrencyCode.Gbp]: [
						createEmptyPrice(CurrencyCode.Gbp, "ProductGroup", productGroup.id),
					],
				},
				productGroupItems: [],
			},
		},
		selectedItems: Promise.resolve([]),
	};
}

const { admin } = await context.shopify.authenticate.admin(request);

const globalProductGroup = await getGlobalProductGroupByIdFromTheDatabase({
	db: context.db,
	id: params.id,
});

if (!globalProductGroup) {
	throw new Response(null, {
		status: 404,
		statusText: "Unable to find product group",
	});
}

const selectedItems = getGlobalProductGroupSelectedItemsFromShopify({
	data: globalProductGroup,
	graphql: admin.graphql,
});

return {
	globalProductGroup,
	selectedItems,
};
}

export default function ProductGroupsShow({
	loaderData,
	params,
}: Route.ComponentProps) {
	useToasts();

	return (
		<LocalizedPage
			title={loaderData.globalProductGroup.title || "Product group"}
			backAction={{
				url: "/app/product-groups",
			}}
		>
			<Form
				validator={GlobalProductGroupValidator}
				defaultValues={loaderData.globalProductGroup}
			>
				<GlobalProductGroupForm id={params.id} />
			</Form>
		</LocalizedPage>
	);
}

export async function action({ context, params, request }: Route.ActionArgs) {
	const { redirect } = await context.shopify.authenticate.admin(request);
	const validator = GlobalProductGroupValidator;

	// TODO: When submitting a form with the `submitSource` of "post" it has type errors of expected number but got string. Can we change the schema to allow or do we need to use `submitSource` of state?

	/**
	 * The insert schema's should just be scoped to the tables themselves, not the nested version we
	 * currently have The validators should almost be route specific or domain specific. i.e. this is
	 * the create global product group validator. That is different to creating a table We can do
	 * minimum: z.coerce.number() in the createInsertSchema function so we can accept strings with
	 * the "post" submitSource We need to transaction a global product group creation
	 */

	const validationResult = await validator.validate(await request.formData());
	if (validationResult.error) {
		return validationError(validationResult.error);
	}

	if (params.id === "new") {
		const globalProductGroup = await createGlobalProductGroup({
			db: context.db,
			data: validationResult.data,
		});

		if (!globalProductGroup) {
			return data(
				toast("There was an error creating the product group", {
					isError: true,
				}),
				{ status: 500 },
			);
		}

		return redirect(`/app/product-groups/${validationResult.data.id}`);
	}
	if (params.id) {
		const globalProductGroup = await updateGlobalProductGroup({
			data: validationResult.data,
			db: context.db,
			id: params.id,
		});

		if (!globalProductGroup) {
			return data(
				toast("There was an error update the product group", {
					isError: true,
				}),
				{ status: 500 },
			);
		}

		return toast("Product group updated");
	}

	return data(
		toast("Product group not found", {
			isError: true,
		}),
		{ status: 500 },
	);
}
