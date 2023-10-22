"use client";

import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { InvalidReducerAction, MissingContextProvider } from "@/exceptions";
import LogoInterpreter from "@/utils/LogoInterpreter/LogoInterpreter";
import { CONTEXT_STATES } from "./LogoBuilderCtx.types";
import type { ContextActions, SavedCommand, InternalValues, LogoBuilderCtxValues, ProviderProps } from "./LogoBuilderCtx.types";

/*************************************************************
 * Constants
 *************************************************************/
export const CONTEXT: React.Context<LogoBuilderCtxValues | undefined> = createContext<LogoBuilderCtxValues | undefined>(undefined);

const DEFAULT_REDUCER: InternalValues = {
	commandsHistory: [],
};

const MAX_HISTORY_LENGTH: number = 1000;

const LOGO_INTERPRETER: LogoInterpreter = new LogoInterpreter();

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
	const registerCanvas = useCallback((type: "draw" | "pointer", canvas: HTMLCanvasElement | null) : void => {
		switch (type) {
			case "draw":
				LOGO_INTERPRETER.setDrawCanvas(canvas);
				break;
			case "pointer":
				LOGO_INTERPRETER.setPointerCanvas(canvas);
				break;
			default:
				throw new Error("Invalid canvas type!"); // TODO
		}
	}, []);
	
	const executeCommand = useCallback((fullCommand: string) : void => {
		const [ command, ...args ] = fullCommand.split(" ");
		LOGO_INTERPRETER.executeCommand(command, ...args);

		dispatch({ type: CONTEXT_STATES.COMMAND_EXECUTED, command: fullCommand, output: fullCommand, success: true });
	}, []);

	/* --- Provider ------------------------------ */
	const context: LogoBuilderCtxValues = useMemo(() : LogoBuilderCtxValues => ({
		...state,
		registerCanvas,
		executeCommand
	}), [executeCommand, registerCanvas, state]);
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