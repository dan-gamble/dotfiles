import { randomUUID } from "node:crypto";
import type {
	PriceableType,
	PricesInsert,
	prices,
} from "~/database/schema/prices";
import type { CurrencyCode } from "~/types/admin.types";
import { PricesValidator } from "~/validators/PricesValidator";

export function createEmptyPrice(
	currencyCode: CurrencyCode,
	priceableType: PriceableType,
	priceableId?: string,
) {
	const priceId = randomUUID();

	return {
		id: priceId,
		amount: 0,
		currencyCode,
		priceableType,
		priceableId: priceableId ?? "",
	} satisfies PricesInsert;
}

export function priceRowsToValidatorStructure(
		rows: (typeof prices.$inferSelect)[],
		priceableId: string,
	): PricesValidator {
		return dedupeRows(rows).reduce<PricesValidator>((prices, row) => {
			if (row.priceableId !== priceableId) return prices;

			const price = {
				id: row.id,
				amount: row.amount,
				currencyCode: row.currencyCode,
				priceableType: row.priceableType,
				priceableId: row.priceableId,
				dependentProductGroupItemId: row.dependentProductGroupItemId,
			};

			const existingPrices = prices[row.currencyCode];

			if (existingPrices) {
				existingPrices.push(price);
			} else {
				prices[row.currencyCode] = [price];
			}

			return prices;
		}, {});
	}

function dedupeRows(
	rows: (typeof prices.$inferSelect)[],
): (typeof prices.$inferSelect)[] {
	const seen = new Set<string>();

	return rows.filter((row) => {
		if (seen.has(row.id)) return false;

		seen.add(row.id);

		return true;
	});
}
