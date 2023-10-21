import type { ReactNode, Ref } from "react";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type SavedCommand = Readonly<{
	timestamp: number,
	command: string
	output: string
	success: boolean
}>

export type InternalValues = {
	commandsHistory: SavedCommand[]
	canvasRef: Ref<HTMLCanvasElement>
}

export type LogoBuilderCtxValues = InternalValues & Readonly<{
	executeCommand: (command: string) => void
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