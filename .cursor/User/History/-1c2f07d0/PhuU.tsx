import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { I18nContext, I18nManager } from "@shopify/react-i18n";
import { boundary } from "@shopify/shopify-app-remix/server";
import { Link, Outlet, useRouteError } from "react-router";
import { ReactRouterAppProvider } from "~/components/ReactRouterAppProvider";
import { LocalizedProvider } from "~/context/LocalizedContext";
import { ShopContext } from "~/context/ShopContext";
import { getShopInfo } from "~/models/Shop/Shop.server";
import { ensureShopIsTracked } from "~/shopify/helpers";
import type { Route } from "./+types/_layout";

export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: polarisStyles },
];

export async function loader({ context, request }: Route.LoaderArgs) {
	const { admin, session } = await context.shopify.authenticate.admin(request);

	await ensureShopIsTracked(context, admin.graphql, {
		shopDomain: session.shop,
	});

	const { shop, shopLocales } = await getShopInfo(admin.graphql);

	return {
		apiKey: context.cloudflare.env.SHOPIFY_API_KEY || "",
		polarisTranslations: await import(
			"../../../node_modules/@shopify/polaris/locales/en.json"
		),
		shop,
		shopLocales,
	};
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 10,
		},
	},
});

export default function App({ loaderData }: Route.ComponentProps) {
	const primaryLocale = loaderData.shopLocales.find((locale) => locale.primary);
	if (!primaryLocale) throw new Error("Unable to establish a primary locale");

	const i18nManager = new I18nManager({
		locale: primaryLocale.locale,
		currency: loaderData.shop.currencyCode,
	});

	return (
		<ReactRouterAppProvider
			apiKey={loaderData.apiKey}
			i18n={loaderData.polarisTranslations}
		>
			<I18nContext.Provider value={i18nManager}>
				<ShopContext.Provider
					value={{ shop: loaderData.shop, shopLocales: loaderData.shopLocales }}
				>
					<LocalizedProvider>
						<NavMenu>
							<Link to="/app">Home</Link>

							<Link to="/app/fake-to-order">Fake to order</Link>

							<Link to="/app/made-to-order">Made to order</Link>

							<Link to="/app/product-groups">Product groups</Link>

							{/*<Link to="/app/notification-styles">Notification styles</Link>*/}
						</NavMenu>

						<Outlet />
					</LocalizedProvider>
				</ShopContext.Provider>
			</I18nContext.Provider>
		</ReactRouterAppProvider>
	);
}

export function ErrorBoundary() {
	return boundary.error(useRouteError());
}

export const headers: Route.HeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};
