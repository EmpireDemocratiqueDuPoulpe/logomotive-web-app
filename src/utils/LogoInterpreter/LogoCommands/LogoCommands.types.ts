import type { LogoCommand } from "./LogoCommands";
import LogoPointer from "../LogoPointer/LogoPointer";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type CommandContext = {
	drawCtx: CanvasRenderingContext2D
	pointerCtx: CanvasRenderingContext2D
	logoPointer: LogoPointer
}

export type ExportedCommands = {
	[key: string]: LogoCommand
}