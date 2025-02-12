import { useCallback } from "react";
import type { PriceableType } from "~/database/schema/prices";
import { CurrencyCode } from "~/types/admin.types";

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
