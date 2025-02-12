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
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useCallback,
	useState,
} from "react";
import type { z } from "zod";
import { useLocalization } from "~/context/LocalizedContext";
import { useMadeToOrder } from "~/context/MadeToOrderContext";
import type { MTOConfigurationValidatorSchema } from "~/validators/MTOConfigurationValidator";

type SetIsActive = Dispatch<SetStateAction<boolean>>;

export type AddProductGroupPopoverProps = {
	activator: (setIsActive: SetIsActive) => PopoverProps["activator"];
};

export function AddProductGroupPopover({
	activator,
}: AddProductGroupPopoverProps) {
	const form = useFormContext<z.infer<typeof MTOConfigurationValidatorSchema>>();
	const localization = useLocalization();

	const { state, dispatch } = useMadeToOrder();

	const [isActive, setIsActive] = useState(false);
	const [globalProductGroup, setGlobalProductGroup] = useState("");
	const [title, setTitle] = useState("");

	const addProductGroup = useCallback(async () => {
		const id = crypto.randomUUID();

		if (typeof state.activeProductGroupId === "undefined") {
			dispatch({ type: "SET_ACTIVE_PRODUCT_GROUP_ID", payload: id });
		}

		if (title !== "") {
			form.setValue("productGroups", [
				...form.transient.value("productGroups"),
				{
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
				},
			]);

			form.setValue("configurationProductGroups", [
				...form.transient.value("configurationProductGroups"),
				{
					madeToOrderConfigurationId: form.transient.value("id"),
					productGroupId: id,
					dependentProductGroupId: null,
				},
			]);
		} else if (globalProductGroup !== "") {
		}
	}, [
		dispatch,
		form.setValue,
		form.transient.value,
		globalProductGroup,
		localization.selectedCurrency.value,
		title,
		state,
	]);

	const handleAdd = useCallback(async () => {
		await addProductGroup();

		setTitle("");
		setIsActive(false);
	}, [addProductGroup]);

	const addDisabled = title === "" && globalProductGroup === "";

	return (
		<Popover
			active={isActive}
			activator={activator(setIsActive)}
			onClose={() => {
				setIsActive(false);
				setTitle("");
				setGlobalProductGroup("");
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
								...state.globalProductGroups.map((globalProductGroup) => {
									return {
										label: globalProductGroup.title,
										value: globalProductGroup.id,
									};
								}),
							]}
							value={globalProductGroup}
							onChange={(value) => {
								setGlobalProductGroup(value);
								setTitle("");
							}}
						/>

						<TextField
							autoComplete="off"
							label="Title"
							value={title}
							onChange={(value) => setTitle(value)}
							disabled={globalProductGroup !== ""}
						/>

						<InlineStack align="start">
							<Button
								variant="primary"
								disabled={addDisabled}
								onClick={async () => await handleAdd()}
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
