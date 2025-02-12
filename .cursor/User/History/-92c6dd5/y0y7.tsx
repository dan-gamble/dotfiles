import {
	createContext,
	type PropsWithChildren,
	useContext,
	useReducer,
} from "react";

type Action = {
	type: "SET_ACTIVE_PRODUCT_GROUP_ID";
	payload: string | undefined;
};
type Dispatch = (action: Action) => void;
type State = {
	activeProductGroupId: string | undefined;
};

const MadeToOrderContext = createContext<
	| {
			state: State;
			dispatch: Dispatch;
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
	});

	return (
		<MadeToOrderContext.Provider value={{ state, dispatch }}>
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
