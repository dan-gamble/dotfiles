import { useCallback } from "react";
import { useFetcher } from "react-router";

const asyncFetcherQueries: Map<string, PromiseWithResolvers<unknown>> = new Map<
	string,
	PromiseWithResolvers<unknown>
>();

const requestIdKey = "__request-id";

export function useAsyncFetcher(): <T>(href: string) => Promise<T> {
	const originalFetcher = useFetcher();

	const fetch = useCallback(
		async <T>(href: string): Promise<T> => {
			const requestId = crypto.randomUUID();

			href = href.includes("?")
				? `${href}&${requestIdKey}=${requestId}`
				: `${href}?${requestIdKey}=${requestId}`;

			const promiseWithResolvers = Promise.withResolvers<T>();

			asyncFetcherQueries.set(
				requestId,
				promiseWithResolvers as PromiseWithResolvers<unknown>,
			);

			originalFetcher.load(href);

			return await promiseWithResolvers.promise;
		},
		[originalFetcher],
	);

	return fetch;
}
