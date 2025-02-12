import {
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useReducer,
} from "react";
import type { getGlobalProductGroups } from "~/models/GlobalProductGroup.server";
import { GlobalProductGroupData } from "~/validators/GlobalProductGroupValidator";
import { ProductGroupData } from "~/validators/ProductGroupValidator";

type Action = {
	type: "SET_ACTIVE_PRODUCT_GROUP_ID";
	payload: string | undefined;
};
type Dispatch = (action: Action) => void;
type State = {
	activeProductGroupId: string | undefined;
	globalProductGroups: Awaited<ReturnType<typeof getGlobalProductGroups>>;
};

const MadeToOrderContext = createContext<
	| {
			state: State;
			dispatch: Dispatch;
			getGlobalProductGroup: (id: string) => GlobalProductGroupData | undefined;
			isGlobalProductGroup: (id: string) => void;
	  }
	| undefined
>(undefined);

function madeToOrderReducer(state: State, { type, payload }: Action): State {
	switch (type) {
		case "SET_ACTIVE_PRODUCT_GROUP_ID": {
			return {
				...state,
				activeProductGroupId: payload,
			};
		}
	}
}

export function MadeToOrderProvider({
	children,
	initialState,
}: PropsWithChildren<{ initialState: State }>) {
	const [state, dispatch] = useReducer(madeToOrderReducer, {
		activeProductGroupId: initialState.activeProductGroupId,
		globalProductGroups: initialState.globalProductGroups ?? [],
	});

	const getGlobalProductGroup = useCallback(
		(id: string) => {
			return state.globalProductGroups.find(
				(globalProductGroup) => globalProductGroup.id === id,
			);
		},
		[state.globalProductGroups],
	);

	const isGlobalProductGroup = useCallback(
		(id: string) => {
			return state.globalProductGroups.some(
				(globalProductGroup) => globalProductGroup.id === id,
			);
		},
		[state.globalProductGroups],
	);

	return (
		<MadeToOrderContext.Provider
			value={{ state, dispatch, getGlobalProductGroup, isGlobalProductGroup }}
		>
			{children}
		</MadeToOrderContext.Provider>
	);
}

export function useMadeToOrder() {
	const context = useContext(MadeToOrderContext);

	if (typeof context === "undefined") {
		throw new Error("useMadeToOrder must be used within a MadeToOrderContext");
	}

	return context;
}
