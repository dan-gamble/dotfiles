import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { timestamps, uuid } from "../utils";
import { productGroups } from "./product-groups";
import { shops } from "./shops";

export const globalProductGroups = sqliteTable("global_product_groups", {
	id: uuid(),

	title: text().notNull(),

	productGroupId: text()
		.references(() => productGroups.id, { onDelete: "cascade" })
		.notNull(),
	shopId: integer()
		.references(() => shops.id)
		.notNull(),

	...timestamps,
});

export const globalProductGroupsInsertSchema =
	createInsertSchema(globalProductGroups);
