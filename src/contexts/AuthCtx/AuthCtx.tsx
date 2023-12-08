"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { usePathname } from "next/navigation";
import { API } from "@/constants";
import { InvalidReducerAction, MissingContextProvider } from "@/exceptions";
import type {
	AuthCtxValues,
	ContextActions,
	InternalValues,
	RegisteringUser,
	ProviderProps,
	User,
	LoginUser
} from "./AuthCtx.types";
import { CONTEXT_STATES } from "./AuthCtx.types";
import toast from "react-hot-toast";

/*************************************************************
 * Constants
 *************************************************************/
export const CONTEXT: React.Context<AuthCtxValues | undefined> = createContext<AuthCtxValues | undefined>(undefined);

const DEFAULT_REDUCER: InternalValues = {
	status: "connecting",
	isConnected: false,
	error: null,
	failedAuth: 0,
	user: null
};

const MAX_AUTH_TRY: number = 3;

/*************************************************************
 * Provider
 *************************************************************/
function canRetryAuth(failedAuth: number) : boolean {
	return failedAuth < MAX_AUTH_TRY;
}

function authReducer(state: InternalValues, action: ContextActions) : InternalValues {
	switch (action.type) {
		case CONTEXT_STATES.CONNECTING:
			return DEFAULT_REDUCER;
		case CONTEXT_STATES.CONNECTED:
			return { ...state, status: "connected", isConnected: true, error: null, failedAuth: 0, user: action.user };
		case CONTEXT_STATES.DISCONNECTED:
			return { ...state, status: "disconnected", isConnected: false, error: (action.error ?? null), failedAuth: 0, user: null };
		case CONTEXT_STATES.FAILED_AUTH:
			const failedAuth: number = state.failedAuth + 1;
			const underLimit: boolean = canRetryAuth(failedAuth);
			return { ...state, status: (underLimit ? "connecting" : "disconnected"), isConnected: false, error: (action.error ?? null), failedAuth, user: null };
		case CONTEXT_STATES.SET_ERROR:
			return { ...state, error: action.error };
		case CONTEXT_STATES.CLEAN_ERROR:
			return { ...state, error: null };
		default:
			throw new InvalidReducerAction((action as ({ type: string, [key: string]: unknown })).type);
	}
}

export function AuthProvider({ children }: ProviderProps) : React.JSX.Element {
	/* --- States -------------------------------- */
	const [ state, dispatch ] = useReducer(authReducer, DEFAULT_REDUCER, undefined);
	const pathname: string = usePathname();

	/* --- Functions ----------------------------- */
	const setConnecting = useCallback(() : void => {
		dispatch({ type: CONTEXT_STATES.CONNECTING });
	}, []);

	const setConnected = useCallback((user: User) : void => {
		dispatch({ type: CONTEXT_STATES.CONNECTED, user });
	}, []);

	const setDisconnected = useCallback((error?: string) : void => {
		dispatch({ type: CONTEXT_STATES.DISCONNECTED, error });
	}, []);

	const addAuthFailure = useCallback((error?: string) : void => {
		dispatch({ type: CONTEXT_STATES.FAILED_AUTH, error });
	}, []);

	const setError = useCallback((error: string) : void => {
		toast.error(error);
		dispatch({ type: CONTEXT_STATES.SET_ERROR, error });
	}, []);

	const cleanError = useCallback(() : void => {
		dispatch({ type: CONTEXT_STATES.CLEAN_ERROR });
	}, []);
	
	const register = useCallback(async (user: RegisteringUser) : Promise<boolean> => {
		let success: boolean = false;
		
		try {
			const response = await API.ENDPOINTS.V1.USERS.register.fetch(user);

			if (response.status !== 200) setError(response.error ?? "Erreur inconnue : Inscription impossible.");
			else {
				success = true;
			}
		} catch (err) {
			setError((err as Error).message);
		}
		
		return success;
	}, [setError]);

	const login = useCallback(async (user: LoginUser) : Promise<boolean> => {
		let success: boolean = false;

		try {
			setConnecting();
			const response = await API.ENDPOINTS.V1.USERS.login.fetch(user);

			if (response.status !== 200) setError(response.error ?? "Erreur inconnue : Connexion impossible.");
			else {
				setConnected(response.data.user);
				success = true;
			}
		} catch (err) {
			setError((err as Error).message);
		}

		return success;
	}, [setConnected, setConnecting, setError]);

	const logout = useCallback(async () : Promise<boolean> => {
		let success: boolean = false;

		try {
			const response = await API.ENDPOINTS.V1.USERS.logout.fetch();

			if (response.status !== 200) setError(response.error ?? "Erreur inconnue : Déconnexion impossible (dommage).");
			else {
				setDisconnected();
				success = true;
			}
		} catch (err) {
			setError((err as Error).message);
		}

		return success;
	}, [setDisconnected, setError]);

	/* --- Effects ------------------------------- */
	// state.error is not a dependency, otherwise the desired effect won't work
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() : void => { if (state.error) cleanError(); }, [pathname]);

	useEffect(() => {
		let isCancelled: boolean = false;

		const authenticate = async () : Promise<void> => {
			try {
				const response = await API.ENDPOINTS.V1.USERS.authenticate.fetch();

				if (!isCancelled) {
					if (response.status !== 200) addAuthFailure(response.error ?? "Erreur inconnue : Authentification impossible.");
					else {
						setConnected(response.data.user);
					}
				}
			} catch (err) {
				if (!isCancelled) {
					addAuthFailure((err as Error).message);
				}
			}
		};

		if (!state.isConnected && canRetryAuth(state.failedAuth)) {
			authenticate().catch(console.error);
		}
		
		return () : void => { isCancelled = true; };
	}, [addAuthFailure, setConnected, setError, state.failedAuth, state.isConnected]);
	
	/* --- Provider ------------------------------ */
	const context: AuthCtxValues = useMemo(() : AuthCtxValues => ({
		...state,
		register,
		login,
		logout
	}), [login, logout, register, state]);
	return (
		<CONTEXT.Provider value={context}>
			{(state.status !== "connecting") && children}
		</CONTEXT.Provider>
	);
}

/*************************************************************
 * Hook
 *************************************************************/
export default function useAuthContext() : AuthCtxValues {
	const authContext: AuthCtxValues | undefined = useContext(CONTEXT);

	if (!authContext) {
		throw new MissingContextProvider(AuthProvider.name);
	}

	return authContext;
}