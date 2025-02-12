import { randomUUID } from "node:crypto";
import * as React from "react";
import { Form } from "~/components/Form";
import { LocalizedPage } from "~/components/LocalizedPage";
import {
	MadeToOrderProvider,
	useMadeToOrder,
} from "~/context/MadeToOrderContext";
import { getGlobalProductGroups } from "~/models/GlobalProductGroup.server";
import { createEmptyPrice } from "~/models/Price.server";
import { MadeToOrderForm } from "~/routes/app/made-to-order/components/MadeToOrderForm";
import { CurrencyCode } from "~/types/admin.types";
import {
	type MTOConfigurationData,
	MTOConfigurationValidator,
} from "~/validators/MTOConfigurationValidator";
import { GlobalProductGroupsSortKey } from "../product-groups/utils";
import type { Route } from "./+types/$id";
import { shops } from "~/database/schema/shops";

export async function loader({ context, params, request }: Route.LoaderArgs) {
	const { session } = await context.shopify.authenticate.admin(request);

	const [shop] = await context.db.select().from(shops);

	const globalProductGroups = await getGlobalProductGroups({
		db: context.db,
		sortKey: GlobalProductGroupsSortKey.TITLE,
		reverse: false,
	});

	if (params.id === "new") {
		const id = randomUUID();

		return {
			configuration: {
				id,
				title: "",
				prices: {
					[CurrencyCode.Gbp]: [
						createEmptyPrice(CurrencyCode.Gbp, "Configuration", id),
					],
				},
				shopId: shop.id,
				productGroups: [],
				configurationProductGroups: [],
			} satisfies MTOConfigurationData,
			globalProductGroups,
		};
	}

	return {
		configuration: null,
		globalProductGroups,
	};
}

export default function MadeToOrderShow({ loaderData }: Route.ComponentProps) {
	return (
		<LocalizedPage
			title="Made to order"
			backAction={{
				url: "/app/made-to-order",
			}}
		>
			<MadeToOrderProvider
				initialState={{
					activeProductGroupId: undefined,
					globalProductGroups: loaderData.globalProductGroups,
				}}
			>
				<Form
					validator={MTOConfigurationValidator}
					defaultValues={loaderData.configuration}
					debug
				>
					<MadeToOrderForm />
				</Form>
			</MadeToOrderProvider>
		</LocalizedPage>
	);
}

type MadeToOrderShowFormProps = {
	configuration: Route.ComponentProps["loaderData"]["configuration"];
};

function MadeToOrderShowForm({ configuration }: MadeToOrderShowFormProps) {
	const { dispatch } = useMadeToOrder();

	return (
		<Form
			validator={MTOConfigurationValidator}
			defaultValues={configuration}
			debug
			onDiscard={() => {
				dispatch({ type: "SET_ACTIVE_PRODUCT_GROUP_ID", payload: undefined });
			}}
		>
			<MadeToOrderForm />
		</Form>
	);
}
