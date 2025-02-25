import { useFormContext } from "@rvf/react-router";
import {
	Box,
	Button,
	FormLayout,
	InlineStack,
	Popover,
	type PopoverProps,
	Select,
	TextField,
} from "@shopify/polaris";
import { useMutation } from "@tanstack/react-query";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useState,
} from "react";
import type { z } from "zod";
import { useLocalization } from "~/context/LocalizedContext";
import { useMadeToOrder } from "~/context/MadeToOrderContext";
import type { MTOConfigurationValidatorSchema } from "~/validators/MTOConfigurationValidator";
import {
	type SelectedItem,
	useProductGroupItems,
} from "~/context/ProductGroupItemsContext";

type SetIsActive = Dispatch<SetStateAction<boolean>>;

export type AddProductGroupPopoverProps = {
	activator: (setIsActive: SetIsActive) => PopoverProps["activator"];
};

export function AddProductGroupPopover({
	activator,
}: AddProductGroupPopoverProps) {
	const form =
		useFormContext<z.infer<typeof MTOConfigurationValidatorSchema>>();
	const localization = useLocalization();

	const {
		state: madeToOrderState,
		dispatch: madeToOrderDispatch,
		getGlobalProductGroup,
	} = useMadeToOrder();

	const { dispatch: productGroupItemsDispatch } = useProductGroupItems();

	const [isActive, setIsActive] = useState(false);
	const [globalProductGroupId, setGlobalProductGroupId] = useState("");
	const [title, setTitle] = useState("");

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const globalProductGroup = getGlobalProductGroup(id);
			if (!globalProductGroup) return null;

			const response = await fetch(
				`/app/product-groups/${globalProductGroup.productGroup.id}/selected-items`,
				{
					headers: {
						"Content-Type": "application-json",
					},
				},
			);

			if (!response.ok) {
				throw new Error("Failed to fetch selected items");
			}

			return (await response.json()) as { selectedItems: SelectedItem[] };
		},
	});

	const addProductGroup = useCallback(async () => {
		const productGroup = (() => {
			if (title !== "") {
				const id = crypto.randomUUID();

				return {
					id,
					title,
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
				};
			}

			if (globalProductGroupId !== "") {
				const globalProductGroup = getGlobalProductGroup(globalProductGroupId);
				if (!globalProductGroup)
					throw new Error("Unable to find global product group");

				return {
					id: globalProductGroup.productGroup.id,
					title: globalProductGroup.productGroup.title,
					minimumNumberOfChoices:
						globalProductGroup.productGroup.minimumNumberOfChoices,
					maximumNumberOfChoices:
						globalProductGroup.productGroup.maximumNumberOfChoices,
					prices: globalProductGroup.productGroup.prices,
					productGroupItems: globalProductGroup.productGroup.productGroupItems,
				};
			}

			throw new Error("Unable to build product group");
		})();

		if (typeof madeToOrderState.activeProductGroupId === "undefined") {
			madeToOrderDispatch({
				type: "SET_ACTIVE_PRODUCT_GROUP_ID",
				payload: productGroup.id,
			});
		}

		if (globalProductGroupId !== "") {
			const response = await mutateAsync(globalProductGroupId);

			if (response) {
				productGroupItemsDispatch({
					type: "SET_SELECTED_ITEMS",
					payload: {
						id: productGroup.id,
						selectedItems: response.selectedItems,
					},
				});
			}
		}

		form.setValue("productGroups", [
			...form.transient.value("productGroups"),
			productGroup,
		]);

		form.setValue("configurationProductGroups", [
			...form.transient.value("configurationProductGroups"),
			{
				madeToOrderConfigurationId: form.transient.value("id"),
				productGroupId: productGroup.id,
				dependentProductGroupId: null,
			},
		]);
	}, [
		form.setValue,
		form.transient.value,
		getGlobalProductGroup,
		globalProductGroupId,
		localization.selectedCurrency.value,
		madeToOrderDispatch,
		madeToOrderState,
		mutateAsync,
		productGroupItemsDispatch,
		title,
	]);

	const handleAdd = useCallback(async () => {
		await addProductGroup();

		setTitle("");
		setGlobalProductGroupId("");
		setIsActive(false);
	}, [addProductGroup]);

	const addDisabled = title === "" && globalProductGroupId === "";

	return (
		<Popover
			active={isActive}
			activator={activator(setIsActive)}
			onClose={() => {
				setIsActive(false);
				setTitle("");
				setGlobalProductGroupId("");
			}}
			autofocusTarget="first-node"
		>
			<div
				onKeyDown={async (e) => {
					if (e.key === "Enter") {
						await handleAdd();
					}
				}}
			>
				<Box padding="400" paddingBlockStart="300">
					<FormLayout>
						<Select
							label="Product group"
							options={[
								{ label: "-", value: "" },
								...madeToOrderState.globalProductGroups.map(
									(globalProductGroup) => {
										return {
											label: globalProductGroup.title,
											value: globalProductGroup.id,
										};
									},
								),
							]}
							value={globalProductGroupId}
							onChange={(value) => {
								setGlobalProductGroupId(value);
								setTitle("");
							}}
						/>

						<TextField
							autoComplete="off"
							label="Title"
							value={title}
							onChange={(value) => setTitle(value)}
							disabled={globalProductGroupId !== ""}
						/>

						<InlineStack align="start">
							<Button
								variant="primary"
								disabled={addDisabled}
								onClick={async () => await handleAdd()}
								loading={isPending}
							>
								Add
							</Button>
						</InlineStack>
					</FormLayout>
				</Box>
			</div>
		</Popover>
	);
}
