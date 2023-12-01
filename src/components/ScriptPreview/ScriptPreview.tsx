"use client";

import React from "react";
import Editor from "react-simple-code-editor";
import Prism, { languageName } from "@/utils/LogoInterpreter/LogoDefinition";
import { downloadTextFile } from "@/utils/files";
import type { Props } from "./ScriptPreview.types";
import styles from "./ScriptPreview.module.css";
import "@/sharedCSS/scriptEditor/scriptEditor.theme.css";
import "prismjs/themes/prism-tomorrow.min.css";

function highlight(code: string, languageName: string, withLineNumbers: boolean = true) : string {
	return Prism.highlight(code, Prism.languages[languageName], languageName)
		.split("\n")
		.map((line: string, idx: number) : string => highlightLine(line, idx, withLineNumbers))
		.join("\n");
}

function highlightLine(code: string, idx: number, withLineNumbers: boolean = true) : string {
	const lineNumber: number = idx + 1;
	const lineNumberSpan: string = withLineNumbers ? `<span class="${styles.editorLineNumber}">${lineNumber}</span>` : "";

	return `<span class="${styles.editorLine}">${lineNumberSpan}${code}</span>`;
}

function ScriptPreview({ script }: Props) : React.JSX.Element {
	/* --- Functions ----------------------------- */
	const downloadScript = () : void => {
		if (script) {
			downloadTextFile("script.logo", script.content);
		}
	};

	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptEditor}>
			<div>
				<button onClick={downloadScript}>Télécharger</button>
			</div>

			<div className={styles.scriptEditorBox}>
				<Editor
					className={`${styles.editor} language-${languageName}`}
					textareaClassName={`${styles.codeArea} language-${languageName}`}
					preClassName={`${styles.codePre} language-${languageName}`}
					value={script.content}
					onValueChange={() => {}}
					highlight={(code: string) => highlight(code, languageName, true) }
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

export default ScriptPreview;