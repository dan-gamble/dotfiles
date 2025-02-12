import { createContext } from "react";

type Action = {};
type Dispatch = (action: Action) => void;
type State = {};

const MadeToOrderCOntext = createContext<
	| {
			state: State;
			dispatch: Dispatch;
	  }
	| undefined
>(undefiend);
