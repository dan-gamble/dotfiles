import { type FormScope, useField, useFieldArray } from "@rvf/react-router";
import {
	Banner,
	BlockStack,
	Box,
	Button,
	IndexTable,
	type IndexTableProps,
	InlineStack,
	SkeletonBodyText,
	SkeletonDisplayText,
	SkeletonThumbnail,
	Spinner,
	Text,
	Thumbnail,
	type ThumbnailProps,
	useBreakpoints,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import type { RowProps } from "@shopify/polaris/build/ts/src/components/IndexTable/components/Row/Row";
import { useEffect, useState } from "react";
import * as React from "react";
import { PricesField } from "~/components/PricesField";
import { useProductGroupItems } from "~/context/ProductGroupItemsContext";
import type { ProductGroupItemV } from "~/validators/ProductGroupItemValidator";
import type { ProductGroupData } from "~/validators/ProductGroupValidator";

import * as styles from "./ProductGroupItemsTable.module.css";
import { useFetcher } from "react-router";

export type ProductGroupItemsTableProps<Type extends ProductGroupItemV[]> = {
	dependentProductGroup?: ProductGroupData;
	productGroupId: string;
	scope: FormScope<Type>;
	thumbnailSize?: ThumbnailProps["size"];
};

export function ProductGroupItemsTable<Type extends ProductGroupItemV[]>({
	dependentProductGroup,
	productGroupId,
	scope,
	thumbnailSize = "medium",
}: ProductGroupItemsTableProps<Type>) {
	const field = useField(scope);
	const fieldArray = useFieldArray(scope);

	const breakpoints = useBreakpoints();

	const columnHeadings: IndexTableProps["headings"] = [
		{ id: "title", title: "Title" },
		{ id: "price", title: "Price" },
	];

	const rowMarkup = field.value().map((item, index) => {
		return (
			<ProductGroupItemsTableRow
				dependentProductGroup={dependentProductGroup}
				key={item.id}
				index={index}
				item={item}
				pricesIndex={0}
				priceableId={item.id}
				productGroupId={productGroupId}
				rowType={
					typeof dependentProductGroup !== "undefined" ? "data" : undefined
				}
				scope={scope}
				thumbnailSize={thumbnailSize}
			/>
		);
	});

	return (
		<IndexTable
			condensed={breakpoints.smDown}
			resourceName={{ singular: "item", plural: "items" }}
			itemCount={fieldArray.length()}
			headings={columnHeadings}
			selectable={false}
		>
			{rowMarkup}
		</IndexTable>
	);
}

type ProductGroupItemsTableRowProps<Type extends ProductGroupItemV> = {
	dependentProductGroup?: ProductGroupItemsTableProps<
		Type[]
	>["dependentProductGroup"];
	dependentProductGroupItemId?: string;
	indented?: boolean;
	index: number;
	item: Type;
	pricesIndex: number;
	priceableId: string;
	productGroupId: ProductGroupItemsTableProps<Type[]>["productGroupId"];
	rowType?: RowProps["rowType"];
	scope: FormScope<Type[]>;
	showVariant?: boolean;
	thumbnailSize?: ProductGroupItemsTableProps<Type[]>["thumbnailSize"];
};

function ProductGroupItemsTableRow<Type extends ProductGroupItemV>({
	dependentProductGroup,
	dependentProductGroupItemId,
	indented = false,
	index,
	item,
	pricesIndex,
	priceableId,
	productGroupId,
	rowType,
	scope,
	showVariant = true,
	thumbnailSize,
}: ProductGroupItemsTableRowProps<Type>) {
	// @ts-expect-error
	const rowScope = scope.scope(`[${index}]`);
	const rowField = useField(rowScope);

	const { getProductGroupItems } = useProductGroupItems();

	console.log(getProductGroupItems(productGroupId));
	
	const selectedProduct = getProductGroupItems(productGroupId).find(
		(shopifyItem) => shopifyItem.productId === item.productId,
	);

	const [rowIsExpanded, setRowIsExpanded] = useState(
		typeof dependentProductGroup !== "undefined",
	);

	if (!selectedProduct) {
		return (
			<IndexTable.Row
				id={item.id}
				key={item.id}
				position={index}
				rowType={rowType}
				tone="critical"
			>
				<IndexTable.Cell colSpan={3}>
					<Banner tone="critical">
						<p>Unable to find selected product for {item.productId}</p>
					</Banner>
				</IndexTable.Cell>
			</IndexTable.Row>
		);
	}

	return (
		<>
			<IndexTable.Row
				id={item.id}
				position={index}
				rowType={rowType}
				tone={rowIsExpanded ? "subdued" : undefined}
				onClick={() => {
					if (typeof dependentProductGroup !== "undefined") {
						setRowIsExpanded((expanded) => !expanded);
					}
				}}
			>
				<IndexTable.Cell>
					<InlineStack gap="400" blockAlign="center" wrap={false}>
						{indented && <Box paddingInlineStart="200" />}

						<Thumbnail
							alt={selectedProduct.title}
							size={thumbnailSize}
							source={selectedProduct?.imageUrl ?? ImageIcon}
						/>

						<Box maxWidth="100%">
							<BlockStack inlineAlign="start">
								<Text as="h4" truncate>
									{selectedProduct.title}
								</Text>

								{dependentProductGroup ? (
									<Text as="span" tone="subdued">
										<Button
											size="medium"
											variant="monochromePlain"
											disclosure={rowIsExpanded ? "up" : "down"}
										>
											{selectedProduct.variantTitle}
										</Button>
									</Text>
								) : (
									showVariant && (
										<Text as="p" tone="subdued">
											{selectedProduct.variantTitle}
										</Text>
									)
								)}
							</BlockStack>
						</Box>
					</InlineStack>
				</IndexTable.Cell>

				{/* @ts-ignore */}
				<IndexTable.Cell className={styles.PriceCell}>
					<div onClick={(e) => e.stopPropagation()}>
						<PricesField
							dependentProductGroupItemId={dependentProductGroupItemId}
							label="Price"
							labelHidden
							index={pricesIndex}
							// @ts-ignore
							scope={rowScope.scope("prices")}
							name={`${rowField.name()}.prices`}
							priceableId={priceableId}
							priceableType="ProductGroupItem"
						/>
					</div>
				</IndexTable.Cell>
			</IndexTable.Row>

			{typeof dependentProductGroup !== "undefined" &&
				rowIsExpanded &&
				dependentProductGroup.productGroupItems.map((item, i) => {
					return (
						<ProductGroupItemsTableRow
							key={item.id}
							dependentProductGroupItemId={dependentProductGroup.id}
							indented
							index={index}
							item={item}
							pricesIndex={i + 1}
							priceableId={priceableId}
							productGroupId={dependentProductGroup.id}
							rowType="child"
							scope={scope}
							showVariant={false}
							thumbnailSize="small"
						/>
					);
				})}
		</>
	);
}
