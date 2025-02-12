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

			// append the request ID
			href = href.includes("?")
				? `${href}&${requestIdKey}=${requestId}`
				: `${href}?${requestIdKey}=${requestId}`;

			const promiseWithResolvers = Promise.withResolvers<T>();

			// store promiseWithResolvers keyed by request ID
			asyncFetcherQueries.set(
				requestId,
				promiseWithResolvers as PromiseWithResolvers<unknown>,
			);

			// initiate loader call
			originalFetcher.load(href);

			// return the promise.
			return await promiseWithResolvers.promise;
		},
		[originalFetcher],
	);

	return fetch;
}
