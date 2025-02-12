import { CurrencyCode } from "@shopify/react-i18n";
import { useCallback } from "react";
import { PriceableType } from "~/database/schema/prices";

export function usePrices() {
	const createDefaultPrice = useCallback(
		({
			currencyCode,
			priceableId,
			priceableType,
			dependentProductGroupItemId,
		}: {
			currencyCode: CurrencyCode;
			priceableId: string;
			priceableType: PriceableType;
			dependentProductGroupItemId?: string;
		}) => {
			return {
				id: crypto.randomUUID(),
				amount: 0,
				currencyCode,
				priceableType,
				priceableId,
				dependentProductGroupItemId,
			};
		},
		[],
	);

	return {
		createDefaultPrice,
	};
}
