import { useFieldArray, useFormContext } from "@rvf/react-router";
import {
	BlockStack,
	Layout,
	PageActions,
	SkeletonBodyText,
	Text,
} from "@shopify/polaris";
import * as React from "react";
import { useMemo, useState } from "react";
import { Await, useLoaderData, useLocation, useNavigate } from "react-router";
import { Card } from "~/components/Card";
import { NumberField } from "~/components/NumberField";
import { PricesField } from "~/components/PricesField";
import { SubmitButton } from "~/components/SubmitButton";
import { TextField } from "~/components/TextField";
import { ProductGroupItemsProvider } from "~/context/ProductGroupItemsContext";
import { ProductGroupItemsCard } from "~/routes/app/product-groups/components/ProductGroupItemsCard";
import type { GlobalProductGroupData } from "~/validators/GlobalProductGroupValidator";
import { GlobalProductGroupsDeleteModal } from "./GlobalProductGroupsDeleteModal";

import type { loader } from "../$id";

export type GlobalProductGroupFormProps = {
	id: string;
};

export function GlobalProductGroupForm({ id }: GlobalProductGroupFormProps) {
	const form = useFormContext<GlobalProductGroupData>();
	const loaderData = useLoaderData<typeof loader>();

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const navigate = useNavigate();

	const location = useLocation();
	const isNew = location.pathname.includes("new");

	console.log(form.formState.fieldErrors);

	const productGroupItems = useFieldArray("productGroup.productGroupItems");

	const choicesSummary = useMemo(() => {
		const minimum =
			form.transient.value("productGroup.minimumNumberOfChoices") ?? 1;
		const maximum =
			form.transient.value("productGroup.maximumNumberOfChoices") ?? 1;

		if (minimum === maximum) {
			return `A customer can only choose ${minimum} item${minimum > 1 ? "s" : ""} from this product group`;
		}

		if (minimum === 0) {
			return "A customer doesn't need to make a choice from this group. This group is considered optional. However, they can ";
		}

		return `A customer can make a minimum of ${minimum} and a maximum of ${maximum} choice${maximum > 1 ? "s" : ""}`;
	}, [form.transient]);

	return (
		<>
			<Layout>
				<Layout.Section>
					<BlockStack gap="400">
						<Card>
							<TextField
								label="Admin label"
								scope={form.scope("title")}
								name={form.name("title")}
							/>
						</Card>

						<Card title="Product group">
							<BlockStack gap="400">
								<TextField
									label="Title"
									scope={form.scope("productGroup.title")}
									name={form.name("productGroup.title")}
									helpText="This is what the product group will be called on the online store"
								/>

								<PricesField
									label="Price"
									scope={form.scope("productGroup.prices")}
									name={form.name("productGroup.prices")}
									helpText="If you want to set the price of every item in the group then please populate this. Please note, any price set on the individual items does override this"
									priceableId={form.value("productGroup.id")}
									priceableType="ProductGroup"
								/>
							</BlockStack>
						</Card>

						<Card title="Choice configuration">
							<BlockStack gap="300">
								<BlockStack gap="300">
									<NumberField
										label="Minimum number of choices"
										scope={form.scope("productGroup.minimumNumberOfChoices")}
										name="productGroup.minimumNumberOfChoices"
									/>

									<NumberField
										label="Maximum number of choices"
										scope={form.scope("productGroup.maximumNumberOfChoices")}
										name="productGroup.maximumNumberOfChoices"
										min={1}
									/>
								</BlockStack>

								<BlockStack gap="300">
									<Text as="p" tone="subdued">
										A configuration is setup by default so that a customer can
										only pick 1 choice per group. Choice configuration however
										allows product groups to operate in different ways. Here a
										are a few examples:
									</Text>

									<BlockStack gap="200">
										<Text as="h4" variant="headingXs">
											1. Optional extras
										</Text>

										<Text as="p" tone="subdued">
											You could set the minimum to 0 and the maximum to 2. This
											means a customer would be able to add up to 2 optional
											extras or skip the group completely.
										</Text>
									</BlockStack>

									<BlockStack gap="200">
										<Text as="h4" variant="headingXs">
											2. Dual fabric
										</Text>

										<Text as="p" tone="subdued">
											You could set the minimum to 2 and the maximum to 2. This
											means a customer would have to select 2 fabrics before
											being able to purchase their MTO item.
										</Text>
									</BlockStack>
								</BlockStack>
							</BlockStack>
						</Card>

						<React.Suspense
							fallback={
								<Card title="Items">
									<SkeletonBodyText />
								</Card>
							}
						>
							<Await resolve={loaderData.selectedItems}>
								{(value) => (
									<ProductGroupItemsProvider
										initialState={{
											selectedItems: new Map([
												[loaderData.globalProductGroup.productGroupId, value],
											]),
										}}
									>
										<ProductGroupItemsCard
											productGroupId={
												loaderData.globalProductGroup.productGroupId
											}
										/>
									</ProductGroupItemsProvider>
								)}
							</Await>
						</React.Suspense>
					</BlockStack>
				</Layout.Section>

				<Layout.Section variant="oneThird">
					<Card title="Summary">
						<BlockStack gap="200">
							<Text as="p">{form.value("title")}</Text>
							<Text as="p">{choicesSummary}</Text>
							<Text as="p">
								This product group contains{" "}
								{form.value("productGroup.productGroupItems").length} items
							</Text>
						</BlockStack>
					</Card>
				</Layout.Section>

				<Layout.Section>
					<PageActions
						primaryAction={<SubmitButton content="Save" />}
						secondaryActions={
							!isNew
								? [
										{
											content: "Delete product group",
											destructive: true,
											onAction() {
												setIsDeleteModalOpen(true);
											},
										},
									]
								: []
						}
					/>
				</Layout.Section>
			</Layout>

			<GlobalProductGroupsDeleteModal
				title="Delete product group"
				body="If you delete this product group, this can't be undone."
				idsToDelete={[id]}
				onCancel={() => setIsDeleteModalOpen(false)}
				onDelete={() => {
					setIsDeleteModalOpen(false);

					navigate("/app/product-groups");
				}}
				onHide={() => setIsDeleteModalOpen(false)}
				open={isDeleteModalOpen}
			/>

			<input
				type="hidden"
				name={form.name("id")}
				defaultValue={form.value("id")}
			/>
			<input
				type="hidden"
				name={form.name("shopId")}
				defaultValue={form.value("shopId")}
			/>
			<input
				type="hidden"
				name={form.name("productGroupId")}
				defaultValue={form.value("productGroupId")}
			/>
			<input
				type="hidden"
				name={form.name("productGroup.id")}
				defaultValue={form.value("productGroup.id")}
			/>

			{productGroupItems.map((key, productGroupItem) => {
				return (
					<React.Fragment key={key}>
						<input
							type="hidden"
							name={productGroupItem.name("id")}
							defaultValue={productGroupItem.value("id")}
						/>
					</React.Fragment>
				);
			})}
		</>
	);
}
