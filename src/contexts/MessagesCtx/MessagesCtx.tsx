"use client";

import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import clsx from "clsx";
import { InvalidReducerAction, MissingContextProvider } from "@/exceptions";
import type {
	Message,
	MessagesCtxValues,
	ContextActions,
	InternalValues,
	ProviderProps
} from "./MessagesCtx.types";
import { CONTEXT_STATES, NewMessage } from "./MessagesCtx.types";
import styles from "./MessagesCtx.module.css";

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
			return { ...state, messages: [...state.messages, { ...action.message, timestamp: Date.now() }].slice(-state.showLimit) };
		default:
			throw new InvalidReducerAction((action as ({ type: string, [key: string]: unknown })).type);
	}
}

export function MessagesProvider({ children }: ProviderProps) : React.JSX.Element {
	/* --- States -------------------------------- */
	const [ state, dispatch ] = useReducer(messagesReducer, DEFAULT_REDUCER, undefined);

	/* --- Functions ----------------------------- */
	const add = useCallback((message: NewMessage) : void => {
		dispatch({ type: CONTEXT_STATES.ADD_MESSAGE, message });
	}, []);

	/* --- Provider ------------------------------ */
	const context: MessagesCtxValues = useMemo(() : MessagesCtxValues => ({
		add
	}), [add]);
	return (
		<CONTEXT.Provider value={context}>
			<div className={styles.messages}>
				<div className={styles.messagesBox}>
					{state.messages.map((message: Message, index: number) => (
						<div key={`message-${message.message}-${index}`} className={clsx(styles.message, styles[message.status])}>
							<span>{message.message}</span>
							{message.action && (
								<button onClick={message.action.onClick}>{message.action.text}</button>
							)}
						</div>
					))}
				</div>
			</div>

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