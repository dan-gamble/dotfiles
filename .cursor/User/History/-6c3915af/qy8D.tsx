import { type FormScope, useField, useFormContext } from "@rvf/react-router";
import {
	Text,
	type TextFieldProps as PolarisTextFieldProps,
	TextField,
} from "@shopify/polaris";
import * as React from "react";
import { useMemo } from "react";
import { useLocalization } from "~/context/LocalizedContext";
import { useProductGroupItems } from "~/context/ProductGroupItemsContext";
import type { PriceableType, PricesInsert } from "~/database/schema/prices";
import { usePrices } from "~/hooks/use-prices";
import type { PricesValidator } from "~/validators/PricesValidator";

export type PricesFieldProps<Type extends PricesValidator> = Omit<
	PolarisTextFieldProps,
	"autoComplete" | "type"
> & {
	dependentProductGroupItemId?: string;
	index?: number;
	label: string;
	name: string;
	priceableId: string;
	priceableType: PriceableType;
	scope: FormScope<Type>;
};

export function PricesField<Type extends PricesValidator>({
	dependentProductGroupItemId,
	index = 0,
	name,
	label,
	scope,
	priceableType,
	priceableId,
	...props
}: PricesFieldProps<Type>) {
	const field = useField(scope);
	const fieldData = field.getControlProps({
		onChange: (value) => field.setValue(value),
	});
	const { selectedCurrency } = useLocalization();
	const { createDefaultPrice } = usePrices();

	const inputName = `${field.name()}.${selectedCurrency.value}[${index}].amount`;

	const currentValues = useMemo(() => {
		const currentValues = fieldData.value?.[selectedCurrency.value];

		if (!currentValues) {
			return [
				createDefaultPrice({
					currencyCode: selectedCurrency.value,
					dependentProductGroupItemId,
					priceableType,
					priceableId,
				}),
			];
		}

		return currentValues;
	}, [
		createDefaultPrice,
		dependentProductGroupItemId,
		fieldData.value,
		priceableId,
		priceableType,
		selectedCurrency.value,
	]);

	const currentValue: PricesInsert = useMemo(() => {
		const value = currentValues[index];

		if (value) {
			return value;
		}

		return createDefaultPrice({
			currencyCode: selectedCurrency.value,
			dependentProductGroupItemId,
			priceableType,
			priceableId,
		});
	}, [
		createDefaultPrice,
		currentValues,
		dependentProductGroupItemId,
		index,
		priceableId,
		priceableType,
		selectedCurrency.value,
	]);

	return (
		<>
			{/* <Text as="p" variant="bodyXs">
					{priceableId} - {dependentProductGroupItemId}
				</Text> */}

			<TextField
				label="Price"
				autoComplete="off"
				type="currency"
				name={inputName}
				prefix={selectedCurrency.symbol}
				value={currentValue.amount.toString()}
				onChange={(textFieldValue: string) => {
					fieldData.onChange({
						...fieldData.value,
						[selectedCurrency.value]: [
							...currentValues.slice(0, index),
							{
								...currentValue,
								amount: Number.parseFloat(textFieldValue),
							},
							...currentValues.slice(index + 1),
						],
					});
				}}
				onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
					if (!e) return;

					fieldData.onChange({
						...fieldData.value,
						[selectedCurrency.value]: [
							...currentValues.slice(0, index),
							{
								...currentValue,
								amount: Number.parseFloat(e.target.value),
							},
							...currentValues.slice(index + 1),
						],
					});
				}}
				{...props}
			/>

			{Object.values(fieldData.value).map((prices) => {
				return prices.map((price, index) => {
					const currencyCode = price.currencyCode;

					return (
						<React.Fragment key={`${currencyCode}.${price.id}`}>
							<input
								type="hidden"
								name={`${field.name()}.${currencyCode}[${index}].id`}
								defaultValue={price.id}
							/>

							<input
								type="hidden"
								name={`${field.name()}.${currencyCode}[${index}].amount`}
								defaultValue={price.amount}
							/>

							<input
								type="hidden"
								name={`${field.name()}.${currencyCode}[${index}].currencyCode`}
								defaultValue={price.currencyCode}
							/>

							<input
								type="hidden"
								name={`${field.name()}.${currencyCode}[${index}].dependentProductGroupItemId`}
								defaultValue={dependentProductGroupItemId}
							/>

							<input
								type="hidden"
								name={`${field.name()}.${currencyCode}[${index}].priceableType`}
								defaultValue={priceableType}
							/>

							<input
								type="hidden"
								name={`${field.name()}.${currencyCode}[${index}].priceableId`}
								defaultValue={priceableId}
							/>
						</React.Fragment>
					);
				});
			})}
		</>
	);
}
