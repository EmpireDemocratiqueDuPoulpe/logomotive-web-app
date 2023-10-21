"use client";

import React, { createContext, createRef, useCallback, useContext, useMemo, useReducer } from "react";
import { InvalidReducerAction, MissingContextProvider } from "@/exceptions";
import { CONTEXT_STATES } from "./LogoBuilderCtx.types";
import type { ContextActions, SavedCommand, InternalValues, LogoBuilderCtxValues, ProviderProps } from "./LogoBuilderCtx.types";

/*************************************************************
 * Constants
 *************************************************************/
export const CONTEXT: React.Context<LogoBuilderCtxValues | undefined> = createContext<LogoBuilderCtxValues | undefined>(undefined);

const DEFAULT_REDUCER: InternalValues = {
	commandsHistory: [],
	canvasRef: createRef<HTMLCanvasElement>()
};

const MAX_HISTORY_LENGTH: number = 1000;

/*************************************************************
 * Provider
 *************************************************************/
function logoBuilderReducer(state: InternalValues, action: ContextActions) : InternalValues {
	switch (action.type) {
		case CONTEXT_STATES.COMMAND_EXECUTED:
			const newCommandsHistory: SavedCommand[] = [{
				timestamp: Date.now(),
				command: action.command,
				output: action.output,
				success: action.success
			}, ...state.commandsHistory];
			newCommandsHistory.length = Math.min(newCommandsHistory.length, MAX_HISTORY_LENGTH);

			return { ...state, commandsHistory: newCommandsHistory };
		default:
			throw new InvalidReducerAction((action as ({ type: string, [key: string]: unknown })).type);
	}
}

export function LogoBuilderProvider({ children }: ProviderProps) : React.JSX.Element {
	/* --- States -------------------------------- */
	const [ state, dispatch ] = useReducer(logoBuilderReducer, DEFAULT_REDUCER, undefined);

	/* --- Functions ----------------------------- */
	const executeCommand = useCallback((command: string) : void => {
		dispatch({ type: CONTEXT_STATES.COMMAND_EXECUTED, command: command, output: command, success: true });
	}, []);
	
	/* --- Effects ------------------------------- */
	/* --- Provider ------------------------------ */
	const context: LogoBuilderCtxValues = useMemo(() : LogoBuilderCtxValues => ({
		...state,
		executeCommand
	}), [executeCommand, state]);
	return (
		<CONTEXT.Provider value={context}>
			{children}
		</CONTEXT.Provider>
	);
}

/*************************************************************
 * Hook
 *************************************************************/
export default function useLogoBuilderContext() : LogoBuilderCtxValues {
	const logoBuilderContext: LogoBuilderCtxValues | undefined = useContext(CONTEXT);

	if (!logoBuilderContext) {
		throw new MissingContextProvider(LogoBuilderProvider.name);
	}

	return logoBuilderContext;
}