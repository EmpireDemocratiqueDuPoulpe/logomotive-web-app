import type { LogoCommand } from "./LogoCommands";
import LogoPointer from "../LogoPointer/LogoPointer";
import LogoDebugger from "@/utils/LogoInterpreter/LogoDebugger/LogoDebugger";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type CommandContext = {
	drawCtx: CanvasRenderingContext2D
	pointerCtx: CanvasRenderingContext2D
	pointer: LogoPointer
	debugger: LogoDebugger
}

export type ExposedCommands = {
	[key: string]: LogoCommand
}