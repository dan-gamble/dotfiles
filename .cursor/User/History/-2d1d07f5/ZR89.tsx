import { useFieldArray, useFormContext } from "@rvf/react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
	Banner,
	Bleed,
	BlockStack,
	Divider,
	IndexTable,
	Text,
	Thumbnail,
	useBreakpoints,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import { useCallback } from "react";
import { Card } from "~/components/Card";
import { CardAdd } from "~/components/CardAdd";
import { PricesField } from "~/components/PricesField";
import { ProductGroupItemsTable } from "~/components/ProductGroupsItemsTable";
import { useLocalization } from "~/context/LocalizedContext";
import { useProductGroupItems } from "~/context/ProductGroupItemsContext";
import type { PricesInsert } from "~/database/schema/prices";
import type { ShopifyGid } from "~/utils/zod/shopify";
import type { GlobalProductGroupData } from "~/validators/GlobalProductGroupValidator";

export type ProductGroupItemsCardProps = {
	productGroupId: string;
};

export function ProductGroupItemsCard(props: ProductGroupItemsCardProps) {
	const form = useFormContext<GlobalProductGroupData>();
	const shopify = useAppBridge();
	
	const { selectedCurrency } = useLocalization();
	const { createDefaultPrice } = usePrices();

	const { state, dispatch, selectProductGroupItems } = useProductGroupItems();

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
						productGroupId: form.transient.value("id"),
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
		form.transient.value,
		productGroupItems.push,
		productGroupItems.shift,
		props.productGroupId,
		selectedCurrency.value,
		state,
		dispatch,
		shopify,
	]);

	const hasValue = productGroupItems.length() > 0;

	const rowMarkup = productGroupItems.map((key, item, index) => {
		const selectedProduct = state.selectedItems.find(
			(selectedItem) => selectedItem.productId === item.value("productId"),
		);

		if (!selectedProduct) {
			return (
				<IndexTable.Row
					id={item.value("id")}
					key={key}
					position={index}
					rowType="data"
					tone="critical"
				>
					<IndexTable.Cell colSpan={4}>
						<Banner tone="critical" key={key}>
							<p>
								Unable to find selected product for {item.value("productId")}
							</p>
						</Banner>
					</IndexTable.Cell>
				</IndexTable.Row>
			);
		}

		// TODO: If this has "dependent on" stuff then this should have sub rows and the prices move into there. The product variants display is a good example of this
		return (
			<IndexTable.Row key={key} id={item.value("id")} position={index}>
				<IndexTable.Cell>
					<Thumbnail
						source={selectedProduct?.imageUrl ?? ImageIcon}
						alt={selectedProduct.title}
					/>

					<input
						type="hidden"
						name={item.name("id")}
						defaultValue={item.value("id")}
					/>

					<input
						type="hidden"
						name={item.name("productId")}
						defaultValue={item.value("productId")}
					/>

					<input
						type="hidden"
						name={item.name("variantId")}
						defaultValue={item.value("variantId")}
					/>

					<input
						type="hidden"
						name={item.name("productGroupId")}
						defaultValue={item.value("productGroupId")}
					/>
				</IndexTable.Cell>

				<IndexTable.Cell>
					<BlockStack>
						<Text as="h4" truncate>
							{selectedProduct.title}
						</Text>
						<Text as="p" variant="bodySm" tone="subdued">
							{selectedProduct.variantTitle}
						</Text>
					</BlockStack>
				</IndexTable.Cell>

				<IndexTable.Cell>
					<PricesField
						label="Price"
						labelHidden
						scope={item.scope("prices")}
						name={item.name("prices")}
						priceableId={item.value("id")}
						priceableType="ProductGroupItem"
					/>
				</IndexTable.Cell>
			</IndexTable.Row>
		);
	});

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
						items={productGroupItems}
						shopifyItems={state.selectedItems}
					/>
				</Bleed>
			)}

			{/*<BlockStack gap="500">*/}
			{/*	/!* TODO: Change this to match how Shopify did it here: https://github.com/Shopify/subscriptions-reference-app/blob/main/app/routes/app.plans.%24id/components/SubscriptionPlanForm/components/ProductPickerCard/ProductPickerCard.tsx#L47. I'm guessing they had the same array swapping issues so did it all "manually" *!/*/}
			{/*	{productGroupItems.map((key, item) => {*/}
			{/*		const selectedProduct = state.selectedItems.find(*/}
			{/*			(selectedItem) =>*/}
			{/*				selectedItem.productId === item.value("productId"),*/}
			{/*		);*/}

			{/*		if (!selectedProduct) {*/}
			{/*			return (*/}
			{/*				<Banner tone="critical" key={key}>*/}
			{/*					<p>*/}
			{/*						Unable to find selected product for {item.value("productId")}*/}
			{/*					</p>*/}
			{/*				</Banner>*/}
			{/*			);*/}
			{/*		}*/}

			{/*		return (*/}
			{/*			<Box*/}
			{/*				key={key}*/}
			{/*				padding="300"*/}
			{/*				borderRadius="100"*/}
			{/*				borderColor="border-secondary"*/}
			{/*				borderWidth="025"*/}
			{/*			>*/}
			{/*				<InlineGrid columns="auto 1fr" gap="400" alignItems="start">*/}
			{/*					<Thumbnail*/}
			{/*						source={selectedProduct?.imageUrl ?? ImageIcon}*/}
			{/*						alt={selectedProduct.title}*/}
			{/*					/>*/}

			{/*					<BlockStack gap="200">*/}
			{/*						<BlockStack gap="100">*/}
			{/*							<Text as="h4" variant="headingSm">*/}
			{/*								{selectedProduct.title}*/}
			{/*							</Text>*/}
			{/*							<Text as="p" variant="bodySm" tone="subdued">*/}
			{/*								{selectedProduct.variantTitle}*/}
			{/*							</Text>*/}
			{/*						</BlockStack>*/}

			{/*						<BlockStack inlineAlign="start">*/}
			{/*							<TextField*/}
			{/*								label="Price"*/}
			{/*								scope={item.scope("price.price")}*/}
			{/*								name={item.name("price.price")}*/}
			{/*								type="currency"*/}
			{/*								prefix="£"*/}
			{/*							/>*/}

			{/*							<input*/}
			{/*								type="hidden"*/}
			{/*								name={item.name("price.id")}*/}
			{/*								defaultValue={item.value("price.id")}*/}
			{/*							/>*/}

			{/*							<input*/}
			{/*								type="hidden"*/}
			{/*								name={item.name("price.productGroupItemId")}*/}
			{/*								defaultValue={item.value("price.productGroupItemId")}*/}
			{/*							/>*/}
			{/*						</BlockStack>*/}
			{/*					</BlockStack>*/}
			{/*				</InlineGrid>*/}

			{/*				<input*/}
			{/*					type="hidden"*/}
			{/*					name={item.name("id")}*/}
			{/*					defaultValue={item.value("id")}*/}
			{/*				/>*/}

			{/*				<input*/}
			{/*					type="hidden"*/}
			{/*					name={item.name("productId")}*/}
			{/*					defaultValue={item.value("productId")}*/}
			{/*				/>*/}

			{/*				<input*/}
			{/*					type="hidden"*/}
			{/*					name={item.name("variantId")}*/}
			{/*					defaultValue={item.value("variantId")}*/}
			{/*				/>*/}

			{/*				<input*/}
			{/*					type="hidden"*/}
			{/*					name={item.name("productGroupId")}*/}
			{/*					defaultValue={item.value("productGroupId")}*/}
			{/*				/>*/}
			{/*			</Box>*/}
			{/*		);*/}
			{/*	})}*/}
			{/*</BlockStack>*/}
		</Card>
	);
}
