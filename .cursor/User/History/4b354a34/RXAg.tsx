import { useFormContext } from "@rvf/react-router";
import { Box, EmptyState } from "@shopify/polaris";
import * as React from "react";
import { useCallback, useState } from "react";
import type { z } from "zod";
import { Card } from "~/components/Card";
import { useLocalization } from "~/context/LocalizedContext";
import { useProductGroupItems } from "~/context/ProductGroupItemsContext";
import type { PricesInsert } from "~/database/schema/prices";
import { ProductGroup } from "~/routes/app/made-to-order/components/ProductGroup";
import type { ShopifyGid } from "~/utils/zod/shopify";
import type { MTOConfigurationValidatorSchema } from "~/validators/MTOConfigurationValidator";
import { ProductGroupManageModal } from "./ProductGroupManageModal";

export default function MadeToOrderShowProductGroups() {
	const form =
		useFormContext<z.infer<typeof MTOConfigurationValidatorSchema>>();
	const localization = useLocalization();

	const { selectProductGroupItems, createDefaultPrice } = useProductGroupItems();

	const [activeProductGroupId, setActiveProductGroupId] = useState<
		string | undefined
	>(undefined);
	const [productGroupManageModalOpen, setProductGroupManageModalOpen] =
		useState(false);
	const activeProductGroupIndex = form
		.value("productGroups")
		.findIndex((productGroup) => productGroup.id === activeProductGroupId);

	const configurationProductGroups = form.value("configurationProductGroups");
	const productGroups = form.value("productGroups");

	// TODO: If the form is reset using the save bar then the `activeProductGroupId` is still set but there are no product groups so the page errors

	const addProductGroup = useCallback(async () => {
		const id = crypto.randomUUID();

		if (typeof activeProductGroupId === "undefined") {
			setActiveProductGroupId(id);
		}

		form.setValue("productGroups", [
			...productGroups,
			{
				id,
				title: "",
				minimumNumberOfChoices: 1,
				maximumNumberOfChoices: 1,
				prices: {
					[localization.selectedCurrency.value]: [
						{
							id: crypto.randomUUID(),
							amount: 0,
							currencyCode: localization.selectedCurrency.value,
							priceableType: "Configuration",
							priceableId: id,
						},
					],
				},
				productGroupItems: [],
			},
		]);

		form.setValue("configurationProductGroups", [
			...configurationProductGroups,
			{
				madeToOrderConfigurationId: form.value("id"),
				productGroupId: id,
				dependentProductGroupId: null,
			},
		]);
	}, [
		activeProductGroupId,
		configurationProductGroups,
		form.setValue,
		form.value,
		localization.selectedCurrency.value,
		productGroups,
	]);

	const manageProductGroupItems = useCallback(
		async (id: string) => {
			const selected = await selectProductGroupItems(id);
			if (!selected) return;

			const productGroups = form.value("productGroups");

			form.setValue(
				"productGroups",
				productGroups
					.map((productGroup) => {
						if (productGroup.id === id) {
							return {
								...productGroup,
								productGroupItems: selected.map((selected) => {
									if (!("variants" in selected)) return null;

									const variantId = selected.variants[0]
										.id as ShopifyGid<"ProductVariant">;
									if (!variantId) return null;

									const existingItem = productGroup.productGroupItems.find(
										(item) => item.productId === selected.id,
									);

									if (existingItem) {
										return {
											...existingItem,
											variantId,
										};
									}

									const id = crypto.randomUUID();

									return {
										id,
										productId: selected.id as ShopifyGid<"Product">,
										variantId,
										productGroupId: productGroup.id,
										prices: {
											[localization.selectedCurrency.value]: [
												createDefaultPrice({
													currencyCode: localization.selectedCurrency.value,
													priceableType: "ProductGroupItem",
													priceableId: id,
												}),
											],
										},
									};
								}),
							};
						}

						return productGroup;
					})
					.filter(Boolean),
			);
		},
		[form.setValue, form.value, localization, selectProductGroupItems],
	);

	return (
		<>
			{productGroups.length === 0 && (
				<Card>
					<EmptyState
						image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
						heading="You currently have no product groups"
						action={{
							content: "Add product group",
							onAction: addProductGroup,
						}}
					>
						<p>Lets get started and add a product group</p>
					</EmptyState>
				</Card>
			)}

			{productGroups.length > 0 && (
				<Card
					title="Product groups"
					headerAction={{
						content: "Add product group",
						onAction: addProductGroup,
					}}
				>
					<Box borderRadius="200" borderWidth="025" borderColor="border">
						{productGroups.map((productGroup, index) => {
							return (
								<ProductGroup
									key={productGroup.id}
									index={index}
									onManageContent={(id) => {
										setActiveProductGroupId(id);
										setProductGroupManageModalOpen(true);
									}}
									onManageProducts={manageProductGroupItems}
									productGroup={productGroup}
								/>
							);
						})}
					</Box>

					<ProductGroupManageModal
						index={activeProductGroupIndex}
						open={productGroupManageModalOpen}
						onHide={() => setProductGroupManageModalOpen(false)}
					/>
				</Card>
			)}
		</>
	);
}
