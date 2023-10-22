import type { ReactNode } from "react";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type SavedCommand = Readonly<{
	timestamp: number,
	command: string
	output: string
	success: boolean
}>

export type InternalValues = {
	commandsHistory: SavedCommand[]
}

export type LogoBuilderCtxValues = InternalValues & Readonly<{
	registerCanvas: (type: "draw" | "pointer", canvas: HTMLCanvasElement | null) => void
	executeCommand: (fullCommand: string) => void
}>

/// --- Context actions ------------------------------------------------------------------------------------------------
export enum CONTEXT_STATES {
	COMMAND_EXECUTED = "COMMAND_EXECUTED"
}

type CommandExecutedAction = {
	type: CONTEXT_STATES.COMMAND_EXECUTED
	command: string
	output: string
	success: boolean
}

export type ContextActions = CommandExecutedAction;

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type ProviderProps = { children?: ReactNode };