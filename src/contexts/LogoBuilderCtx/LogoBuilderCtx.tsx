"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { MissingContextProvider } from "@/exceptions";
import LogoInterpreter from "@/utils/LogoInterpreter/LogoInterpreter";
import type { LogoBuilderCtxValues, ProviderProps } from "./LogoBuilderCtx.types";

/*************************************************************
 * Constants
 *************************************************************/
export const CONTEXT: React.Context<LogoBuilderCtxValues | undefined> = createContext<LogoBuilderCtxValues | undefined>(undefined);

const LOGO_INTERPRETER: LogoInterpreter = new LogoInterpreter();

/*************************************************************
 * Provider
 *************************************************************/
export function LogoBuilderProvider({ children }: ProviderProps) : React.JSX.Element {
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
	
	const executeCommand = useCallback((command: string) : void => {
		LOGO_INTERPRETER.executeCommand(command);
	}, []);

	/* --- Provider ------------------------------ */
	const context: LogoBuilderCtxValues = useMemo(() : LogoBuilderCtxValues => ({
		interpreter: LOGO_INTERPRETER,
		registerCanvas,
		executeCommand
	}), [executeCommand, registerCanvas]);
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