"use client";

import React from "react";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import Editor from "react-simple-code-editor";
import ScriptEditorExecuteButton from "@/components/ScriptEditor/ScriptEditorExecuteButton/ScriptEditorExecuteButton";
import ScriptEditorSaveButton from "@/components/ScriptEditor/ScriptEditorSaveButton/ScriptEditorSaveButton";
import ScriptEditorEditButton from "@/components/ScriptEditor/ScriptEditorEditButton/ScriptEditorEditButton";
import ScriptEditorDownloadButton
	from "@/components/ScriptEditor/ScriptEditorDownloadButton/ScriptEditorDownloadButton";
import ScriptEditorShareButton from "@/components/ScriptEditor/ScriptEditorShareButton/ScriptEditorShareButton";
import { languageName } from "@/utils/LogoInterpreter/LogoDefinition";
import type { Props } from "./ScriptEditor.types";
import styles from "./ScriptEditor.module.css";
import "@/sharedCSS/scriptEditor/scriptEditor.theme.css";
import "prismjs/themes/prism-tomorrow.min.css";

function ScriptEditor({ editable = true }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();

	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptEditor}>
			{scriptEditorCtx.isLoading ? <p>Chargement en cours...</p> : (
				scriptEditorCtx.isLoadError ? null : (
					<Editor
						className={`${styles.editor} language-${languageName}`}
						textareaClassName={`${styles.codeArea} language-${languageName}`}
						preClassName={`${styles.codePre} language-${languageName}`}
						value={scriptEditorCtx.currentScript.content}
						onValueChange={editable ? scriptEditorCtx.changeScriptContent : () => {}}
						highlight={(code: string) => scriptEditorCtx.highlight(code, languageName, true) }
						padding={10}
						style={{
							fontFamily: "\"Fira code\", \"Fira Mono\", monospace",
							fontSize: 12,
						}}
						tabSize={1}
						insertSpaces={false}
						ignoreTabKey={false}
					/>
				)
			)}
		</div>
	);
}
ScriptEditor.ExecuteButton = ScriptEditorExecuteButton;
ScriptEditor.SaveButton = ScriptEditorSaveButton;
ScriptEditor.EditButton = ScriptEditorEditButton;
ScriptEditor.DownloadButton = ScriptEditorDownloadButton;
ScriptEditor.ShareButton = ScriptEditorShareButton;

export default ScriptEditor;