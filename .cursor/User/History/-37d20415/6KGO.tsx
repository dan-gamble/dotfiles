import { useFormContext } from "@rvf/react-router";
import { Select } from "@shopify/polaris";
import type { SelectOption } from "@shopify/polaris/build/ts/src/components/Select/Select";
import { useMemo, useState } from "react";
import type { z } from "zod";
import type {
	MTOConfigurationData,
	MTOConfigurationValidatorSchema,
} from "~/validators/MTOConfigurationValidator";

export type DependentOnSelectProps = {
	productGroup: MTOConfigurationData["productGroups"][number];
};

export function DependentOnSelect({ productGroup }: DependentOnSelectProps) {
	const form = useFormContext<z.infer<typeof MTOConfigurationValidatorSchema>>();
	const productGroups = form.value("productGroups");

	const [dependent, setDependent] = useState("");

	const productGroupIndex = productGroups.findIndex(
		(group) => group.id === productGroup.id,
	);

	const options: SelectOption[] = useMemo(() => {
		return [
			{ value: "", label: "-" },
			...productGroups
				.filter((_, index) => index <= productGroupIndex)
				.filter((group) => group.id !== productGroup.id)
				.map((productGroup) => {
					console.log(productGroup, productGroup.title ?? productGroup.title);

					return {
						label: productGroup.title || productGroup.id,
						value: productGroup.id,
					};
				}),
		];
	}, [productGroup, productGroupIndex, productGroups]);

	return (
		<Select
			label="Dependent on"
			options={options}
			value={dependent}
			onChange={(selected) => {
				setDependent(selected);

				form.setValue(
					"configurationProductGroups",
					form.transient
						.value("configurationProductGroups")
						.map((configurationProductGroup) => {
							if (
								configurationProductGroup.productGroupId === productGroup.id
							) {
								return {
									...configurationProductGroup,
									dependentProductGroupId: selected ?? null,
								};
							}

							return configurationProductGroup;
						}),
				);
			}}
		/>
	);
}
