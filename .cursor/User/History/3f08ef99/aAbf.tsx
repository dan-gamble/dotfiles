import { useAppBridge } from "@shopify/app-bridge-react";
import { type PropsWithChildren, useCallback, useContext } from "react";
import * as React from "react";

export interface SelectedItem {
	selected: boolean;
	productId: string;
	variantId: string;
	title: string;
	variantTitle: string;
	imageUrl?: string;
}

type Action = {
	type: "SET_SELECTED_ITEMS";
	payload: { id: string; selectedItems: SelectedItem[] };
};
type Dispatch = (action: Action) => void;
type State = { selectedItems: Map<string, SelectedItem[]> };

const ProductGroupItemsContext = React.createContext<
	| {
			state: State;
			dispatch: Dispatch;
			selectProductGroupItems: (
				id: string,
			) => ReturnType<typeof shopify.resourcePicker>;
			getProductGroupItems: (id: string) => SelectedItem[];
	  }
	| undefined
>(undefined);

function productGroupsItemsReducer(state: State, action: Action) {
	switch (action.type) {
		case "SET_SELECTED_ITEMS": {
			state.selectedItems.set(action.payload.id, action.payload.selectedItems);

			return {
				...state,
				selectedItems: new Map(state.selectedItems),
			};
		}
	}
}

export function ProductGroupItemsProvider({
	children,
	initialState,
}: PropsWithChildren<{ initialState: State }>) {
	const shopify = useAppBridge();
	const [state, dispatch] = React.useReducer(productGroupsItemsReducer, {
		selectedItems: initialState.selectedItems ?? new Map(),
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const selectProductGroupItems = useCallback(
		async (id: string) => {
			const selectedItems = state.selectedItems.get(id) ?? [];

			const selected = await shopify.resourcePicker({
				type: "product",
				multiple: true,
				action: "select",
				selectionIds: selectedItems.map((selectedItem) => {
					return {
						id: selectedItem.productId,
						variants: [
							{
								id: selectedItem.variantId,
							},
						],
					};
				}),
			});
			if (!selected) return;

			dispatch({
				type: "SET_SELECTED_ITEMS",
				payload: {
					id,
					selectedItems: selected
						.map((selectedItem) => {
							if (!("variants" in selectedItem)) return null;

							const variant = selectedItem.variants[0];
							if (!(variant?.id && variant?.title)) return null;

							return {
								selected: true,
								productId: selectedItem.id,
								variantId: variant.id,
								variantTitle: variant.title,
								title: selectedItem.title,
								imageUrl: selectedItem.images?.[0]?.originalSrc,
							};
						})
						.filter(Boolean),
				},
			});

			return selected;
		},
		[state.selectedItems],
	);

	const getProductGroupItems = useCallback(
		(id: string) => {
			const items = state.selectedItems.get(id);

			return items ?? [];
		},
		[state.selectedItems],
	);

	const value = {
		state,
		dispatch,
		selectProductGroupItems,
		getProductGroupItems,
	};

	return (
		<ProductGroupItemsContext.Provider value={value}>
			{children}
		</ProductGroupItemsContext.Provider>
	);
}

export function useProductGroupItems() {
	const context = useContext(ProductGroupItemsContext);

	if (typeof context === "undefined") {
		throw new Error(
			"useProductGroupItems must be used within a ProductGroupItemsProvider",
		);
	}

	return context;
}
