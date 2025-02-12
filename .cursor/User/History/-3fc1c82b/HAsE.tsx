import { useFormContext } from "@rvf/react-router";
import {
	ActionList,
	BlockStack,
	Box,
	Button,
	Icon,
	InlineGrid,
	Popover,
	Text,
} from "@shopify/polaris";
import { CatalogIcon, ContentIcon, DeleteIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import * as React from "react";
import type { z } from "zod";
import { ProductGroupItemsTable } from "~/components/ProductGroupsItemsTable";
import { DependentOnSelect } from "~/routes/app/made-to-order/components/DependentOnSelect";
import type {
	MTOConfigurationData,
	MTOConfigurationValidatorSchema,
} from "~/validators/MTOConfigurationValidator";

export type ProductGroupProps = {
	index: number;
	onManageContent: (id: string) => void;
	onManageProducts: (id: string) => Promise<void>;
	onRemove: (id: string) => void;
	productGroup: MTOConfigurationData["productGroups"][number];
};

export function ProductGroup({
	index,
	onManageContent,
	onManageProducts,
	onRemove,
	productGroup,
}: ProductGroupProps) {
	const form =
		useFormContext<z.infer<typeof MTOConfigurationValidatorSchema>>();

	const [popoverOpen, setPopoverOpen] = useState(false);

	const configurationProductGroups = form.value("configurationProductGroups");
	const configurationProductGroup = configurationProductGroups.find(
		(configurationProductGroup) => {
			return configurationProductGroup.productGroupId === productGroup.id;
		},
	);
	if (!configurationProductGroup) return null;

	const productGroups = form.value("productGroups");

	const dependentProductGroup = productGroups.find((productGroup) => {
		return (
			productGroup.id === configurationProductGroup.dependentProductGroupId
		);
	});

	return (
		<BlockStack key={productGroup.id} gap="0">
			<Box
				background="bg-surface-secondary"
				padding="300"
				borderBlockStartWidth={index === 0 ? "0" : "025"}
				borderBlockEndWidth="025"
				borderColor="border"
			>
				<InlineGrid columns="1fr auto">
					<Text as="h4" variant="headingSm">
						{productGroup.title || productGroup.id}
					</Text>

					<Popover
						active={popoverOpen}
						activator={
							<Button
								variant="plain"
								onClick={() => setPopoverOpen(true)}
								disclosure={popoverOpen ? "up" : "down"}
							>
								Manage
							</Button>
						}
						onClose={() => {
							setPopoverOpen(false);
						}}
					>
						{/* TODO: Shall we move this to sit alongside the title as a popover and a ...? */}
						{index > 0 && (
							<Popover.Pane fixed>
								<Popover.Section>
									<DependentOnSelect productGroup={productGroup} />
								</Popover.Section>
							</Popover.Pane>
						)}

						<Popover.Pane>
							<ActionList
								actionRole="menuitem"
								items={[
									{
										content: "Manage content",
										prefix: <Icon source={ContentIcon} />,
										onAction: () => {
											setPopoverOpen(false);

											onManageContent(productGroup.id);
										},
									},
									{
										content: "Manage products",
										prefix: <Icon source={CatalogIcon} />,
										onAction: async () => {
											setPopoverOpen(false);

											await onManageProducts(productGroup.id);
										},
									},
									{
										content: "Remove",
										destructive: true,
										prefix: <Icon source={DeleteIcon} />,
										onAction: () => {
											setPopoverOpen(false);

											onRemove(productGroup.id);
										},
									},
								]}
							/>
						</Popover.Pane>
					</Popover>
				</InlineGrid>
			</Box>

			{productGroup.productGroupItems.length === 0 && (
				<Box padding="300">
					<Text as="p">
						This product group currently has no products. Get started by{" "}
						<Button
							variant="plain"
							onClick={() => onManageProducts(productGroup.id)}
						>
							adding one
						</Button>
					</Text>
				</Box>
			)}

			{productGroup.productGroupItems.length > 0 && (
				<ProductGroupItemsTable
					dependentProductGroup={dependentProductGroup}
					productGroupId={productGroup.id}
					scope={form.scope(`productGroups[${index}].productGroupItems`)}
					thumbnailSize="medium"
				/>
			)}
		</BlockStack>
	);
}
