import type { Database } from "../../load-context/database";
import { randomUUID } from "node:crypto";
import { globalProductGroups } from "~/database/schema/global-product-groups";
import type { ProductGroupsInsert } from "~/database/schema/product-groups";

export async function getGlobalProductGroupIdFromProductGroupId({
	db,
	id,
}: {
	db: Database;
	id: string;
}) {
	const [globalProductGroup] = await db.select().from(globalProductGroups);
}

export function createEmptyProductGroup() {
	const productGroupId = randomUUID();

	return {
		id: productGroupId,
		title: "",
		minimumNumberOfChoices: 1,
		maximumNumberOfChoices: 1,
	} satisfies ProductGroupsInsert;
}
