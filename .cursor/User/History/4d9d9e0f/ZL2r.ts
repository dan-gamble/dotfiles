import { randomUUID } from "node:crypto";
import type {
	PriceableType,
	PricesInsert,
	prices,
} from "~/database/schema/prices";
import type { CurrencyCode } from "~/types/admin.types";
import type { PricesValidator } from "~/validators/PricesValidator";

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
): PricesValidator {
	return Object.fromEntries(
		rows.map((row) => {
			return [
				row.currencyCode,
				[
					{
						id: row.id,
						amount: row.amount,
						currencyCode: row.currencyCode,
						priceableType: row.priceableType,
						priceableId: row.priceableId,
					},
				],
			];
		}),
	);
}
