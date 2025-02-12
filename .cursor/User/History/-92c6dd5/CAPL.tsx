import { createContext } from "react";

type Action = {
	type: "SET_ACTIVE_PRODUCT_GROUP_ID";
	payload: string;
};
type Dispatch = (action: Action) => void;
type State = {
	activeProductGroupId: string;
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
