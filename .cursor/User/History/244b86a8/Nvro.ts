import { withZod } from "@rvf/zod";
import { z } from "zod";
import { madeToOrderConfigurationProductGroupsInsertSchema } from "~/database/schema/made-to-order-configuration-product-groups";
import { madeToOrderConfigurationsInsertSchema } from "~/database/schema/made-to-order-configurations";
import { refineProductGroupsInsertSchema } from "~/database/schema/product-groups";
import { PricesValidatorSchema } from "~/validators/PricesValidator";
import { ProductGroupItemValidatorSchema } from "./ProductGroupItemValidator";

export type MTOConfigurationData = z.infer<
	typeof MTOConfigurationValidatorSchema
>;

export const MTOConfigurationValidatorSchema =
	madeToOrderConfigurationsInsertSchema.extend({
		prices: PricesValidatorSchema,
		configurationProductGroups: z.array(
			madeToOrderConfigurationProductGroupsInsertSchema,
		),
		productGroups: z.array(
			refineProductGroupsInsertSchema({
				prices: PricesValidatorSchema,
				productGroupItems: z.array(ProductGroupItemValidatorSchema),
			}),
		),
	});

export const MTOConfigurationValidator = withZod(
	MTOConfigurationValidatorSchema,
);
