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
	canvas: HTMLCanvasElement | null
}

export type LogoBuilderCtxValues = InternalValues & Readonly<{
	registerCanvas: (canvas: HTMLCanvasElement | null) => void
	executeCommand: (fullCommand: string) => void
}>

/// --- Context actions ------------------------------------------------------------------------------------------------
export enum CONTEXT_STATES {
	REGISTER_CANVAS = "REGISTER_CANVAS",
	COMMAND_EXECUTED = "COMMAND_EXECUTED"
}

type RegisterCanvasAction = { type: CONTEXT_STATES.REGISTER_CANVAS, canvas: HTMLCanvasElement | null }

type CommandExecutedAction = {
	type: CONTEXT_STATES.COMMAND_EXECUTED
	command: string
	output: string
	success: boolean
}

export type ContextActions = RegisterCanvasAction | CommandExecutedAction;

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type ProviderProps = { children?: ReactNode };