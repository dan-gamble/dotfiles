import {
	type RouteConfig,
	index,
	layout,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("webhooks", "routes/shopify/webhooks.tsx"),

	...prefix("a-route", [
		index("routes/a-route.tsx"),

		route("b-route", "routes/b-route.tsx"),
	]),

	...prefix("auth", [route(":id", "routes/shopify/auth.$.tsx")]),

	...prefix("app", [
		layout("routes/app/_layout.tsx", [
			index("routes/app/index.tsx"),

			...prefix("made-to-order", [
				index("routes/app/made-to-order/index.tsx"),
				route(":id", "routes/app/made-to-order/$id.tsx"),

				// layout("routes/app/made-to-order/$id._layout.tsx", [
				// 	route(":id", "routes/app/made-to-order/$id.tsx", [
				// 		route(
				// 			"product-groups",
				// 			"routes/app/made-to-order/$id.product-groups.tsx",
				// 		),
				// 	]),
				// ]),
			]),

			...prefix("product-groups", [
				index("routes/app/product-groups/index.tsx"),
				route(":id", "routes/app/product-groups/$id.tsx"),
				route(
					":id/selected-items",
					"routes/app/product-groups/$id.selected-items.tsx",
				),
			]),
		]),
	]),
] satisfies RouteConfig;
