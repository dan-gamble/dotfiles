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

export async function handleClientLoaderForAsyncFetcher({
	request,
	serverLoader,
}: ClientLoaderFunctionArgs): Promise<unknown> {
	const { searchParams } = new URL(request.url);
	const requestId = searchParams.get(requestIdKey);

	try {
		// call the server loader
		const serverResponse = await serverLoader();

		// if request ID is present, resolve the promise with the server data
		if (requestId) {
			// This is undocumented, but if you do a redirect in the loader,
			// `serverLoader()` will resolve to a Response object.
			// When we encounter a Response object we treat that as a fetch
			// error. Since we are planning to use @tanstack/react-query
			// we can rely on it retrying the request afterwards.
			if (serverResponse instanceof Response) {
				asyncFetcherQueries
					.get(requestId)
					?.reject(new Error("Encountered a Response object"));
			} else {
				asyncFetcherQueries.get(requestId)?.resolve(serverResponse);
				asyncFetcherQueries.delete(requestId);
			}
		}

		// Return the data to ensure Remix's
		// data hooks function as expected.
		return serverResponse;
	} catch (e) {
		if (!requestId) {
			// rethrow when there is no Request ID
			// to ensure Remix's data hooks function
			// as expected.
			throw e;
		}

		asyncFetcherQueries.get(requestId)?.reject(e);
		asyncFetcherQueries.delete(requestId);
		return null;
	}
}
