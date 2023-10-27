import type { LogoCommand } from "./LogoCommands";
import LogoPointer from "../LogoPointer/LogoPointer";
import LogoDebugger from "@/utils/LogoInterpreter/LogoDebugger/LogoDebugger";
import LogoInterpreter from "@/utils/LogoInterpreter/LogoInterpreter";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type CommandContext = {
	interpreter: LogoInterpreter
	pointer: LogoPointer
	debugger: LogoDebugger
}

export type ExposedCommands = {
	[key: string]: LogoCommand
}