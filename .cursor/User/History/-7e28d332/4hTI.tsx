import { randomUUID } from "node:crypto";
import * as React from "react";
import { Form } from "~/components/Form";
import { LocalizedPage } from "~/components/LocalizedPage";
import {
	MadeToOrderProvider,
	useMadeToOrder,
} from "~/context/MadeToOrderContext";
import { createEmptyPrice } from "~/models/Price.server";
import { MadeToOrderForm } from "~/routes/app/made-to-order/components/MadeToOrderForm";
import { CurrencyCode } from "~/types/admin.types";
import { MTOConfigurationValidator } from "~/validators/MTOConfigurationValidator";
import type { Route } from "./+types/$id";
import { getGlobalProductGroups } from "~/models/GlobalProductGroup.server";
import { GlobalProductGroupsSortKey } from "../product-groups/utils";

export async function loader({ context, params }: Route.LoaderArgs) {
	const globalProductGroups = await getGlobalProductGroups({
		db: context.db,
		sortKey: GlobalProductGroupsSortKey.TITLE,
		reverse: false,
	});

	console.log({ globalProductGroups });

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
				productGroups: [],
				configurationProductGroups: [],
			},
		};
	}

	return {
		configuration: null,
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
