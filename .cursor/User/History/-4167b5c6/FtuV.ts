import { real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { CurrencyCode } from "../../types/admin.types";
import { timestamps, uuid } from "../utils";
import { productGroupItems } from "./product-group-items";
import { madeToOrderConfigurations } from "./made-to-order-configurations";

export const PriceableTypes = [
	"Configuration",
	"ProductGroup",
	"ProductGroupItem",
] as const;
export type PriceableType = (typeof PriceableTypes)[number];

export const prices = sqliteTable(
	"prices",
	{
		id: uuid(),

		amount: real().notNull(),
		currencyCode: text().$type<CurrencyCode>().notNull(),

		priceableType: text({
			enum: PriceableTypes,
		}).notNull(),
		priceableId: text().notNull(),

		configurationId: text().references(() => madeToOrderConfigurations.id),
		dependentProductGroupItemId: text().references(() => productGroupItems.id),

		...timestamps,
	},
	(table) => [
		unique("idx_prices_unique_combination").on(
			table.priceableType,
			table.priceableId,
			table.currencyCode,
			table.configurationId,
			table.dependentProductGroupItemId,
		),
	],
);

export const pricesInsertSchema = createInsertSchema(prices, {
	amount: z.coerce.number(),
	currencyCode: z.nativeEnum(CurrencyCode),
});
export type PricesInsert = z.infer<typeof pricesInsertSchema>;
