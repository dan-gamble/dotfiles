import { getPaginationQueryVariablesFromUrl } from "~/utils/pagination";
import { getSearchQueryQueryVariablesFromUrl } from "~/utils/query";

export const GlobalProductGroupsSortKey = {
	TITLE: "TITLE",
	CREATED_AT: "CREATED_AT",
	UPDATED_AT: "UPDATED_AT",
} as const;
type SortKeyType =
	(typeof GlobalProductGroupsSortKey)[keyof typeof GlobalProductGroupsSortKey];

export const SORT_ORDER_PARAM = "order";

export function getSellingPlanGroupsQueryVariables(url: URL) {
	const paginationQueryVariables = getPaginationQueryVariablesFromUrl(url);
	const sortVariables = getSortVariablesFromurl(url);
	const searchQueryVariables = getSearchQueryQueryVariablesFromUrl(url);

	return {
		...paginationQueryVariables,
		...sortVariables,
		...searchQueryVariables,
	};
}

function getSortVariablesFromurl(url: URL) {
	if (!url) return {};

	const selectedSort = getSortSelectedFromParam(
		url.searchParams.get(SORT_ORDER_PARAM),
	);
	const [sortKey, direction] = selectedSort[0].split(" ");
	const reverse = direction !== "asc";

	return {
		sortKey: sortKey as SortKeyType,
		reverse,
	};
}

export function getSortSelectedFromParam(param: string | null): string[] {
	const defaultSort = `${GlobalProductGroupsSortKey.UPDATED_AT} desc`;
	if (!param) return [defaultSort];

	const [sortKeyParam, sortDirectionParam] = param.split(" ");

	const sortKeyValid =
		sortKeyParam &&
		Object.values(GlobalProductGroupsSortKey).some(
			(key) => key === sortKeyParam.toUpperCase(),
		);

	const sortDirectionValid =
		sortDirectionParam && ["asc", "desc"].includes(sortDirectionParam);

	return sortKeyValid && sortDirectionValid
		? [`${sortKeyParam.toUpperCase()} ${sortDirectionParam}`]
		: [defaultSort];
}
