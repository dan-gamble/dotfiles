import { useFormContext } from "@rvf/react-router";
import { BlockStack, Layout } from "@shopify/polaris";
import * as React from "react";
import { Outlet } from "react-router";
import type { z } from "zod";
import { Card } from "~/components/Card";
import { PricesField } from "~/components/PricesField";
import { TextField } from "~/components/TextField";
import { ProductGroupItemsProvider } from "~/context/ProductGroupItemsContext";
import ProductGroups from "~/routes/app/made-to-order/components/ProductGroups";
import type { MTOConfigurationValidatorSchema } from "~/validators/MTOConfigurationValidator";

export function MadeToOrderForm() {
	const form =
		useFormContext<z.infer<typeof MTOConfigurationValidatorSchema>>();

		console.log(form.value());

	return (
		<>
			<input
				type="hidden"
				name={form.name("id")}
				defaultValue={form.value("id")}
			/>

			<Layout>
				<Layout.Section>
					<BlockStack gap="400">
						<Card>
							<TextField
								label="Title"
								scope={form.scope("title")}
								name="title"
							/>

							<PricesField
								label="Price"
								scope={form.scope("prices")}
								name={form.name("prices")}
								helpText="This is the base price of the product before any configuration options are chosen."
								priceableId={form.value("id")}
								priceableType="Configuration"
							/>
						</Card>

						<ProductGroupItemsProvider
							initialState={{
								selectedItems: new Map(),
							}}
						>
							<ProductGroups />
						</ProductGroupItemsProvider>
					</BlockStack>
				</Layout.Section>

				<Layout.Section variant="oneThird">
					<Card title="Summary">
						<p>Tree</p>
					</Card>
				</Layout.Section>
			</Layout>
		</>
	);
}
