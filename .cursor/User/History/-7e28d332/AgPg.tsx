import { randomUUID } from "node:crypto";
import * as React from "react";
import { Form } from "~/components/Form";
import { LocalizedPage } from "~/components/LocalizedPage";
import { createEmptyPrice } from "~/models/Price.server";
import { MadeToOrderForm } from "~/routes/app/made-to-order/components/MadeToOrderForm";
import { CurrencyCode } from "~/types/admin.types";
import { MTOConfigurationValidator } from "~/validators/MTOConfigurationValidator";
import type { Route } from "./+types/$id";
import { MadeToOrderProvider } from "~/context/MadeToOrderContext";

export async function loader({ context, params }: Route.LoaderArgs) {
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
