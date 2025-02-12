import type { PlatformProxy } from "wrangler";
import { setupDatabase } from "./database";
import type { Env } from "./env";
import { setupSession } from "./session";
import { setupShopifyApp } from "./shopify";
import { QueryClient } from "@tanstack/react-query";

type GetLoadContextArgs = {
	request: Request;
	context: {
		cloudflare: Omit<PlatformProxy<Env>, "dispose" | "caches" | "cf"> & {
			caches: PlatformProxy<Env>["caches"] | CacheStorage;
			cf: Request["cf"];
		};
	};
};

declare module "react-router" {
	interface AppLoadContext extends Awaited<ReturnType<typeof getLoadContext>> {}
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 10,
		},
	},
});

export async function getLoadContext({ context }: GetLoadContextArgs) {
	const db = await setupDatabase(context.cloudflare.env);
	const shopify = setupShopifyApp(context.cloudflare.env);

	const session = setupSession(context.cloudflare.env, shopify);

	return {
		...context,
		db,
		queryClient,
		session,
		shopify,
	};
}
