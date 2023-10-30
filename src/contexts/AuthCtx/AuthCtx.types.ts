import type { ReactNode } from "react";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type AuthStatus = "connecting" | "connected" | "disconnected";

export type User = {
	userID: number
	username: string
	email: string
}

export type RegisteringUser = {
	username: string
	email: string
	password1: string
	password2: string
}

export type LoginUser = {
	email: string
	password: string
}

export type InternalValues = {
	status: AuthStatus
	isConnected: boolean
	error: string | null
	failedAuth: number
	user: User | null
}

export type AuthCtxValues = Omit<InternalValues, "failedAuth"> & Readonly<{
	register: (user: RegisteringUser) => Promise<boolean>
	login: (user: LoginUser) => Promise<boolean>
	logout: () => Promise<boolean>
}>

/// --- Context actions ------------------------------------------------------------------------------------------------
export enum CONTEXT_STATES {
	CONNECTING = "CONNECTING",
	CONNECTED = "CONNECTED",
	DISCONNECTED = "DISCONNECTED",
	FAILED_AUTH = "FAILED_AUTH",
	SET_ERROR = "SET_ERROR",
	CLEAN_ERROR = "CLEAN_ERROR"
}

type ConnectingAction = { type: CONTEXT_STATES.CONNECTING }

type ConnectedAction = { type: CONTEXT_STATES.CONNECTED, user: User }

type DisconnectedAction = { type: CONTEXT_STATES.DISCONNECTED, error?: string }

type FailedAuthAction = { type: CONTEXT_STATES.FAILED_AUTH, error?: string }

type SetErrorAction = { type: CONTEXT_STATES.SET_ERROR, error: string }

type CleanErrorAction = { type: CONTEXT_STATES.CLEAN_ERROR }


export type ContextActions =
	ConnectingAction
	| ConnectedAction
	| DisconnectedAction
	| FailedAuthAction
	| SetErrorAction
	| CleanErrorAction;

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type ProviderProps = { children?: ReactNode };
