import type { MouseEvent, ReactNode } from "react";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type Message = {
	status: "success" | "info" | "warning" | "error"
	message: string
	action?: {
		text: string
		onClick: (event: MouseEvent) => void
	}
	timestamp: number
}
export type NewMessage = Omit<Message, "timestamp">;

export type InternalValues = {
	messages: Message[]
	showLimit: number
}

export type MessagesCtxValues = Omit<InternalValues, "messages" | "showLimit"> & Readonly<{
	add: (message: NewMessage) => void
}>

/// --- Context actions ------------------------------------------------------------------------------------------------
export enum CONTEXT_STATES {
	ADD_MESSAGE = "ADD_MESSAGE"
}

type AddMessageAction = { type: CONTEXT_STATES.ADD_MESSAGE, message: NewMessage }

export type ContextActions = AddMessageAction;

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type ProviderProps = { children?: ReactNode };
