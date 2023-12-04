import type { ReactNode } from "react";
import type { ScriptError } from "@/utils/LogoInterpreter/LogoInterpreter.types";
import type { Script } from "@/typings/global";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type PartialScript = Pick<Script, "name" | "content" | "is_public"> & {
	script_id?: number | null | undefined
	tags: string
};

export type InternalValues = {
	currentScript: PartialScript
	runtimeErrors: ScriptError[]
}

export type ScriptEditorCtxValues = InternalValues & Readonly<{
	isLoading: boolean
	isLoadError: boolean
	changeScriptName: (name: string) => void
	changeScriptContent: (content: string) => void
	changeScriptTags: (tags: string) => void
	changeScriptPublicStatus: (isPublic: boolean) => void
	setScript: (script: PartialScript) => void
	executeScript: () => void
	saveScript: () => void
	downloadScript: () => void
	highlight: (code: string, languageName: string, withLineNumbers: boolean) => string
}>

/// --- Context actions ------------------------------------------------------------------------------------------------
export enum CONTEXT_STATES {
	CHANGE_SCRIPT_NAME = "CHANGE_SCRIPT_NAME",
	CHANGE_SCRIPT_CONTENT = "CHANGE_SCRIPT_CONTENT",
	CHANGE_SCRIPT_TAGS = "CHANGE_SCRIPT_TAGS",
	CHANGE_SCRIPT_PUBLIC_STATUS = "CHANGE_SCRIPT_PUBLIC_STATUS",
	SET_SCRIPT = "SET_SCRIPT",
	SET_RUNTIME_ERRORS = "SET_RUNTIME_ERRORS"
}

type ChangeScriptNameAction = { type: CONTEXT_STATES.CHANGE_SCRIPT_NAME, name: string }

type ChangeScriptContentAction = { type: CONTEXT_STATES.CHANGE_SCRIPT_CONTENT, content: string }

type ChangeScriptTagsAction = { type: CONTEXT_STATES.CHANGE_SCRIPT_TAGS, tags: string }

type ChangeScriptPublicStatusAction = { type: CONTEXT_STATES.CHANGE_SCRIPT_PUBLIC_STATUS, isPublic: boolean }

type SetScriptAction = { type: CONTEXT_STATES.SET_SCRIPT, script: PartialScript }

type SetRuntimeErrorsAction = { type: CONTEXT_STATES.SET_RUNTIME_ERRORS, errors: ScriptError[] }

export type ContextActions =
	ChangeScriptNameAction
	| ChangeScriptContentAction
	| ChangeScriptTagsAction
	| ChangeScriptPublicStatusAction
	| SetScriptAction
	| SetRuntimeErrorsAction;

/// --- PropTypes ------------------------------------------------------------------------------------------------------
export type ProviderProps = {
	scriptID?: number | undefined
	children?: ReactNode
};
