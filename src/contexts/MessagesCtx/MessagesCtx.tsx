"use client";

import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { InvalidReducerAction, MissingContextProvider } from "@/exceptions";
import type {
	Message,
	MessagesCtxValues,
	ContextActions,
	InternalValues,
	ProviderProps
} from "./MessagesCtx.types";
import { CONTEXT_STATES } from "./MessagesCtx.types";

/*************************************************************
 * Constants
 *************************************************************/
export const CONTEXT: React.Context<MessagesCtxValues | undefined> = createContext<MessagesCtxValues | undefined>(undefined);

const DEFAULT_REDUCER: InternalValues = {
	messages: [],
	showLimit: 3
};

/*************************************************************
 * Provider
 *************************************************************/
function messagesReducer(state: InternalValues, action: ContextActions) : InternalValues {
	switch (action.type) {
		case CONTEXT_STATES.ADD_MESSAGE:
			return { ...state, messages: [...state.messages, action.message].slice(-state.showLimit) };
		default:
			throw new InvalidReducerAction((action as ({ type: string, [key: string]: unknown })).type);
	}
}

export function MessagesProvider({ children }: ProviderProps) : React.JSX.Element {
	/* --- States -------------------------------- */
	const [ state, dispatch ] = useReducer(messagesReducer, DEFAULT_REDUCER, undefined);

	/* --- Functions ----------------------------- */
	const add = useCallback((message: Message) : void => {
		dispatch({ type: CONTEXT_STATES.ADD_MESSAGE, message });
	}, []);

	/* --- Provider ------------------------------ */
	const context: MessagesCtxValues = useMemo(() : MessagesCtxValues => ({
		add
	}), [add]);
	return (
		<CONTEXT.Provider value={context}>
			{state.messages.map((message: Message) => (
				<div>
					{message.message}
					{message.action && (
						<button onClick={message.action.onClick}>{message.action.text}</button>
					)}
				</div>
			))}

			{children}
		</CONTEXT.Provider>
	);
}

/*************************************************************
 * Hook
 *************************************************************/
export default function useMessageContext() : MessagesCtxValues {
	const messageContext: MessagesCtxValues | undefined = useContext(CONTEXT);

	if (!messageContext) {
		throw new MissingContextProvider(MessagesProvider.name);
	}

	return messageContext;
}