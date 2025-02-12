import { useFormContext } from "@rvf/react-router";
import { BlockStack, Box, Button, EmptyState, Text } from "@shopify/polaris";
import { useCallback, useState } from "react";
import type { z } from "zod";
import { Card } from "~/components/Card";
import { useLocalization } from "~/context/LocalizedContext";

import { useMadeToOrder } from "~/context/MadeToOrderContext";
import { useProductGroupItems } from "~/context/ProductGroupItemsContext";
import { usePrices } from "~/hooks/use-prices";
import { ProductGroup } from "~/routes/app/made-to-order/components/ProductGroup";
import type { ShopifyGid } from "~/utils/zod/shopify";
import type { MTOConfigurationValidatorSchema } from "~/validators/MTOConfigurationValidator";
import { AddProductGroupPopover } from "./AddProductGroupPopover";
import { ProductGroupManageModal } from "./ProductGroupManageModal";

export default function MadeToOrderShowProductGroups() {
	const form =
		useFormContext<z.infer<typeof MTOConfigurationValidatorSchema>>();
	const localization = useLocalization();

	const { state, dispatch } = useMadeToOrder();
	const { createDefaultPrice } = usePrices();
	const { selectProductGroupItems } = useProductGroupItems();

	const [productGroupManageModalOpen, setProductGroupManageModalOpen] =
		useState(false);
	const activeProductGroupIndex = form
		.value("productGroups")
		.findIndex(
			(productGroup) => productGroup.id === state.activeProductGroupId,
		);

	const productGroups = form.value("productGroups");

	const manageProductGroupItems = useCallback(
		async (id: string) => {
			const selected = await selectProductGroupItems(id);
			if (!selected) return;

			form.setValue(
				"productGroups",
				form.transient
					.value("productGroups")
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
		[
			createDefaultPrice,
			form.setValue,
			form.transient,
			localization,
			selectProductGroupItems,
		],
	);

	const removeProductGroup = useCallback(
		(id: string) => {
			dispatch({ type: "SET_ACTIVE_PRODUCT_GROUP_ID", payload: undefined });

			form.setValue(
				"productGroups",
				form.transient
					.value("productGroups")
					.filter((productGroup) => productGroup.id !== id),
			);
		},
		[dispatch, form.setValue, form.transient.value],
	);

	return (
		<>
			{productGroups.length === 0 && (
				<Card>
					<EmptyState
						image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
						heading="You currently have no product groups"
					>
						<BlockStack gap="400" inlineAlign="center">
							<Text as="p">Lets get started and add a product group</Text>

							<AddProductGroupPopover
								activator={(setIsActive) => {
									return (
										<Button
											onClick={() => setIsActive((active) => !active)}
											variant="primary"
										>
											Add product group
										</Button>
									);
								}}
							/>
						</BlockStack>
					</EmptyState>
				</Card>
			)}

			{productGroups.length > 0 && (
				<Card
					title="Product groups"
					headerAction={
						<AddProductGroupPopover
							activator={(setIsActive) => {
								return (
									<Button
										onClick={() => setIsActive((active) => !active)}
										variant="plain"
									>
										Add product group
									</Button>
								);
							}}
						/>
					}
				>
					<Box borderRadius="200" borderWidth="025" borderColor="border">
						{productGroups.map((productGroup, index) => {
							return (
								<ProductGroup
									key={productGroup.id}
									index={index}
									onManageContent={(id) => {
										dispatch({
											type: "SET_ACTIVE_PRODUCT_GROUP_ID",
											payload: id,
										});
										setProductGroupManageModalOpen(true);
									}}
									onManageProducts={manageProductGroupItems}
									onRemove={removeProductGroup}
									productGroup={productGroup}
								/>
							);
						})}
					</Box>

					{state.activeProductGroupId && (
						<ProductGroupManageModal
							index={activeProductGroupIndex}
							open={productGroupManageModalOpen}
							onHide={() => setProductGroupManageModalOpen(false)}
						/>
					)}

					<AddProductGroupPopover
						activator={(setIsActive) => {
							return (
								<Button onClick={() => setIsActive((active) => !active)}>
									Add product group
								</Button>
							);
						}}
					/>
				</Card>
			)}
		</>
	);
}
