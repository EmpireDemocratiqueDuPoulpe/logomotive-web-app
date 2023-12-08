"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import Prism from "@/utils/LogoInterpreter/LogoDefinition";
import useScript from "@/hooks/scripts/useScript";
import { InvalidReducerAction, MissingContextProvider } from "@/exceptions";
import type {
	ContextActions,
	InternalValues,
	PartialScript,
	ProviderProps,
	ScriptEditorCtxValues
} from "./ScriptEditorCtx.types";
import { CONTEXT_STATES } from "./ScriptEditorCtx.types";
import type { ScriptError, ScriptReturn } from "@/utils/LogoInterpreter/LogoInterpreter.types";
import type { NewScript, UpdatingScript } from "@/typings/global";
import toast from "react-hot-toast";
import { downloadTextFile } from "@/utils/files";
import styles from "./ScriptEditorCtx.module.css";


/*************************************************************
 * Constants
 *************************************************************/
export const CONTEXT: React.Context<ScriptEditorCtxValues | undefined> = createContext<ScriptEditorCtxValues | undefined>(undefined);

const DEFAULT_REDUCER: InternalValues = {
	currentScript: {
		name: "",
		content: "",
		tags: "",
		is_public: false
	},
	runtimeErrors: []
};

/*************************************************************
 * Provider
 *************************************************************/
function highlightLine(code: string, idx: number, errors: ScriptError[], withLineNumbers: boolean = true) : string {
	const lineNumber: number = idx + 1;
	const lineNumberSpan: string = withLineNumbers ? `<span class="${styles.editorLineNumber}">${lineNumber}</span>` : "";

	let errorOverlay: string = "";
	const lineError: ScriptError[] = errors.filter(e => e.line === lineNumber);

	if (lineError.length) {
		const lineLength: number = new DOMParser().parseFromString(code, "text/html").body.innerText.length;
		errorOverlay = `<div class="${styles.editorLineError}"><span class="${styles.errorText}">${Array.from({ length: lineLength }, (): string => " ").join("")}${lineError[0].error}</span></div>`;
	}

	return `<span class="${clsx(styles.editorLine, (!code && styles.emptyLine))}">${lineNumberSpan}${code}${errorOverlay}</span>`;
}

function scriptEditorReducer(state: InternalValues, action: ContextActions) : InternalValues {
	switch (action.type) {
		case CONTEXT_STATES.CHANGE_SCRIPT_NAME:
			return { ...state, currentScript: { ...state.currentScript, name: action.name } };
		case CONTEXT_STATES.CHANGE_SCRIPT_CONTENT:
			return { ...state, currentScript: { ...state.currentScript, content: action.content } };
		case CONTEXT_STATES.CHANGE_SCRIPT_TAGS:
			return { ...state, currentScript: { ...state.currentScript, tags: action.tags } };
		case CONTEXT_STATES.CHANGE_SCRIPT_PUBLIC_STATUS:
			return { ...state, currentScript: { ...state.currentScript, is_public: action.isPublic } };
		case CONTEXT_STATES.SET_SCRIPT:
			return { ...state, currentScript: action.script };
		case CONTEXT_STATES.SET_RUNTIME_ERRORS:
			return { ...state, runtimeErrors: action.errors };
		default:
			throw new InvalidReducerAction((action as ({ type: string, [key: string]: unknown })).type);
	}
}

export function ScriptEditorProvider({ scriptID, children }: ProviderProps) : React.JSX.Element {
	/* --- States -------------------------------- */
	const [ state, dispatch ] = useReducer(scriptEditorReducer, DEFAULT_REDUCER, undefined);
	const scriptHook = useScript(scriptID ?? null);
	const logoBuilderCtx = useLogoBuilderContext();
	const router = useRouter();

	/* --- Functions ----------------------------- */
	const changeScriptName = useCallback((name: string) : void => {
		dispatch({ type: CONTEXT_STATES.CHANGE_SCRIPT_NAME, name });
	}, []);

	const changeScriptContent = useCallback((content: string) : void => {
		dispatch({ type: CONTEXT_STATES.CHANGE_SCRIPT_CONTENT, content });
	}, []);
	
	const changeScriptTags = useCallback((tags: string) : void => {
		dispatch({ type: CONTEXT_STATES.CHANGE_SCRIPT_TAGS, tags });
	}, []);
	
	const changeScriptPublicStatus = useCallback((isPublic: boolean) : void => {
		dispatch({ type: CONTEXT_STATES.CHANGE_SCRIPT_PUBLIC_STATUS, isPublic });
	}, []);

	const setScript = useCallback((script: PartialScript) : void => {
		dispatch({ type: CONTEXT_STATES.SET_SCRIPT, script });
	}, []);

	const setRuntimeErrors = useCallback((errors: ScriptError[]) : void => {
		dispatch({ type: CONTEXT_STATES.SET_RUNTIME_ERRORS, errors });
	}, []);

	const executeScript = useCallback(() : void => {
		const scriptReturn: ScriptReturn = logoBuilderCtx.interpreter.executeScript(state.currentScript.content);

		if (scriptReturn.status === "failed") {
			setRuntimeErrors(scriptReturn.errors);
		} else setRuntimeErrors([]);
	}, [logoBuilderCtx.interpreter, setRuntimeErrors, state.currentScript.content]);

	const saveScript = useCallback(() : void => {
		const newScriptData = {
			...state.currentScript,
			tags: state.currentScript.tags.split(",").map(t => t.trim()).filter(Boolean)
		};

		toast.promise(new Promise<void>((resolve, reject) : void => {
			if (newScriptData.script_id) {
				scriptHook.update.mutate(newScriptData as UpdatingScript, {
					onSuccess: () => resolve(),
					onError: (error: unknown) => reject(error),
				});
			} else {
				scriptHook.create.mutate(newScriptData as NewScript, {
					onSuccess: ({ data: {script_id: newScriptID} }) : void => {
						router.replace(`/build?scriptID=${newScriptID}`);
						resolve();
					},
					onError: (error: unknown) => reject(error)
				});
			}
		}), {
			loading: "Sauvegarde du script...",
			success: "Script sauvegardé.",
			error: "Erreur lors de la sauvegarde du script."
		}).catch();
	}, [router, scriptHook.create, scriptHook.update, state.currentScript]);

	const downloadScript = useCallback(() : void => {
		downloadTextFile("script.logo", state.currentScript.content);
	}, [state.currentScript.content]);

	const highlight = useCallback((code: string, languageName: string, withLineNumbers: boolean = true) : string => {
		return Prism.highlight(code, Prism.languages[languageName], languageName)
			.split("\n")
			.map((line: string, idx: number) : string => highlightLine(line, idx, state.runtimeErrors, withLineNumbers))
			.join("\n");
	}, [state.runtimeErrors]);

	/* --- Effects ------------------------------- */
	useEffect(() : void => {
		if (scriptHook.data?.data) {
			setScript({
				script_id: scriptHook.data.data.script.script_id,
				name: scriptHook.data.data.script.name,
				content: scriptHook.data.data.script.content,
				tags: scriptHook.data.data.script.tags?.join(",") ?? "",
				is_public: scriptHook.data.data.script.is_public,
			});
		}
		// We only want to update the script editor when the data is updated.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scriptHook.dataUpdatedAt]);
	
	useEffect(() : void => {
		if (!scriptID && state.currentScript.script_id) {
			setScript(DEFAULT_REDUCER.currentScript);
		}
	}, [scriptID, setScript, state.currentScript.script_id]);
	
	/* --- Provider ------------------------------ */
	const context: ScriptEditorCtxValues = useMemo(() : ScriptEditorCtxValues => ({
		...state,
		isLoading: scriptHook.isLoading,
		isLoadError: scriptHook.isError,
		changeScriptName,
		changeScriptContent,
		changeScriptTags,
		changeScriptPublicStatus,
		setScript,
		executeScript,
		saveScript,
		downloadScript,
		highlight
	}), [changeScriptContent, changeScriptName, changeScriptPublicStatus, changeScriptTags, downloadScript, executeScript, highlight, saveScript, scriptHook.isError, scriptHook.isLoading, setScript, state]);
	return (
		<CONTEXT.Provider value={context}>
			{children}
		</CONTEXT.Provider>
	);
}

/*************************************************************
 * Hook
 *************************************************************/
export default function useScriptEditorContext() : ScriptEditorCtxValues {
	const scriptEditorContext: ScriptEditorCtxValues | undefined = useContext(CONTEXT);

	if (!scriptEditorContext) {
		throw new MissingContextProvider(ScriptEditorProvider.name);
	}

	return scriptEditorContext;
}