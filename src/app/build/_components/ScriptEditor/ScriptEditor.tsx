"use client";

import React, { useState } from "react";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import type { ScriptError, ScriptReturn } from "@/utils/LogoInterpreter/LogoInterpreter.types";
import Editor from "react-simple-code-editor";
import Prism, { languageName } from "@/utils/LogoInterpreter/LogoDefinition";
import styles from "./ScriptEditor.module.css";
import "./ScriptEditor.theme.css";
import "prismjs/themes/prism-tomorrow.min.css";


function highlight(code: string, languageName: string, errors: ScriptError[], withLineNumbers: boolean = true) : string {
	return Prism.highlight(code, Prism.languages[languageName], languageName)
		.split("\n")
		.map((line: string, idx: number) : string => highlightLine(line, idx, errors, withLineNumbers))
		.join("\n");
}

function highlightLine(code: string, idx: number, errors: ScriptError[], withLineNumbers: boolean = true) : string {
	const lineNumber: number = idx + 1;
	const lineNumberSpan: string = withLineNumbers ? `<span class="${styles.editorLineNumber}">${lineNumber}</span>` : "";

	let errorOverlay: string = "";
	const lineError: ScriptError[] = errors.filter(e => e.line === lineNumber);

	if (lineError.length) {
		const lineLength: number = new DOMParser().parseFromString(code, "text/html").body.innerText.length;
		errorOverlay = `<div class="${styles.editorLineError}"><span class="${styles.errorText}">${Array.from({ length: lineLength }, (): string => " ").join("")}${lineError[0].error}</span></div>`;
	}

	return `<span class="${styles.editorLine}">${lineNumberSpan}${code}${errorOverlay}</span>`;
}

function ScriptEditor() : React.JSX.Element {
	/* --- States -------------------------------- */
	const logoBuilderCtx = useLogoBuilderContext();
	const [ script, setScript ] = useState<string>("AV 100\nTD 90\nAV 100\nTD 90\nAV 100\nTD 90\nAV 100\nTD 90\nCT");
	const [ errors, setErrors ] = useState<ScriptError[]>([]);

	/* --- Functions ----------------------------- */
	const executeScript = () : void => {
		const scriptReturn: ScriptReturn = logoBuilderCtx.interpreter.executeScript(script);

		if (scriptReturn.status === "failed") {
			setErrors(scriptReturn.errors);
		}
	};

	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptEditor}>
			<button onClick={executeScript}>Exécuter &gt;</button>

			<div className={styles.scriptEditorBox}>
				<Editor
					className={`${styles.editor} language-${languageName}`}
					textareaClassName={`${styles.codeArea} language-${languageName}`}
					preClassName={`${styles.codePre} language-${languageName}`}
					value={script}
					onValueChange={setScript}
					highlight={(code: string) => highlight(code, languageName, errors, true) }
					padding={10}
					style={{
						fontFamily: "\"Fira code\", \"Fira Mono\", monospace",
						fontSize: 12,
					}}
					tabSize={1}
					insertSpaces={false}
					ignoreTabKey={false}
				/>
			</div>
		</div>
	);
}

export default ScriptEditor;