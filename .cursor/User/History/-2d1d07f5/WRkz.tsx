import { useFieldArray, useFormContext } from "@rvf/react-router";
import { Bleed, Divider } from "@shopify/polaris";
import { useCallback } from "react";
import { Card } from "~/components/Card";
import { CardAdd } from "~/components/CardAdd";
import { ProductGroupItemsTable } from "~/components/ProductGroupsItemsTable";
import { useLocalization } from "~/context/LocalizedContext";
import { useProductGroupItems } from "~/context/ProductGroupItemsContext";
import { usePrices } from "~/hooks/use-prices";
import type { ShopifyGid } from "~/utils/zod/shopify";
import type { GlobalProductGroupData } from "~/validators/GlobalProductGroupValidator";

export type ProductGroupItemsCardProps = {
	productGroupId: string;
};

export function ProductGroupItemsCard(props: ProductGroupItemsCardProps) {
	const form = useFormContext<GlobalProductGroupData>();
	
	const { selectedCurrency } = useLocalization();
	const { createDefaultPrice } = usePrices();

	const { selectProductGroupItems } = useProductGroupItems();

	const productGroupItems = useFieldArray(
		form.scope("productGroup.productGroupItems"),
	);

	const selectItems = useCallback(async () => {
		const selected = await selectProductGroupItems(form.transient.value("id"));
		if (!selected) return;

		const existingItems = form.transient.value(
			"productGroup.productGroupItems",
		);

		form.setValue(
			"productGroup.productGroupItems",
			selected
				.map((selected) => {
					if (!("variants" in selected)) return null;

					const variantId = selected.variants[0]
						.id as ShopifyGid<"ProductVariant">;
					if (!variantId) return null;

					const existingItem = existingItems.find(
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
						productGroupId: props.productGroupId,
						prices: {
							[selectedCurrency.value]: [
								createDefaultPrice({
									currencyCode: selectedCurrency.value,
									priceableType: "ProductGroupItem",
									priceableId: id,
								}),
							],
						},
					};
				})
				.filter(Boolean),
		);
	}, [
		createDefaultPrice,
		form.setValue,
		form.transient.value,
		props.productGroupId,
		selectProductGroupItems,
		selectedCurrency.value,
	]);

	const hasValue = productGroupItems.length() > 0;

	return (
		<Card
			title="Items"
			headerAction={
				hasValue
					? {
							content: "Manage items",
							async onAction() {
								await selectItems();
							},
						}
					: undefined
			}
		>
			{!hasValue && <CardAdd onClick={selectItems} text="Add items" />}

			{hasValue && (
				<Bleed marginInline="400" marginBlockEnd="400">
					<Divider />

					<ProductGroupItemsTable
						productGroupId={props.productGroupId}
						scope={form.scope("productGroup.productGroupItems")}
						thumbnailSize="medium"
					/>
				</Bleed>
			)}
		</Card>
	);
}
