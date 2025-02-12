import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { type ShopifyGid, shopifyGid } from "../../utils/zod/shopify";
import { timestamps, uuid } from "../utils";
import { shops } from "./shops";

export const madeToOrderConfigurations = sqliteTable(
	"made_to_order_configurations",
	{
		id: uuid(),
		title: text().notNull(),
		sku: text().notNull(),

		shopId: integer()
			.references(() => shops.id)
			.notNull(),
		productId: text().notNull().$type<ShopifyGid<"Product">>().unique(),

		...timestamps,
	},
);

export const madeToOrderConfigurationsInsertSchema = createInsertSchema(
	madeToOrderConfigurations,
	{
		productId: shopifyGid("Product"),
	},
);
