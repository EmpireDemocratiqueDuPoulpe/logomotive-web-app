"use client";

import React, { useState } from "react";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import Editor from "react-simple-code-editor";
import Prism, { languageName } from "@/utils/LogoInterpreter/LogoDefinition";
import styles from "./ScriptEditor.module.css";
import "./ScriptEditor.theme.css";
import "prismjs/themes/prism-tomorrow.min.css";


function highlightWithLineNumbers(code: string, languageName: string) : string {
	return Prism.highlight(code, Prism.languages[languageName], languageName)
		.split("\n")
		.map((line: string, idx: number) : string => `<span class="${styles.editorLineNumber}">${idx + 1}</span>${line}`)
		.join("\n");
}

function ScriptEditor() : React.JSX.Element {
	/* --- States -------------------------------- */
	const [ script, setScript ] = useState<string>("AV 80\nRE 60\nMT");
	const logoBuilderCtx = useLogoBuilderContext();

	console.log((Prism.languages.js)["keyword"]);
	console.log((Prism.languages[languageName])["keyword"]);
	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptEditor}>
			<Editor
				className={`${styles.editor} language-${languageName}`}
				textareaClassName={`${styles.codeArea} language-${languageName}`}
				preClassName={`${styles.codePre} language-${languageName}`}
				value={script}
				onValueChange={setScript}
				highlight={(code: string) => highlightWithLineNumbers(code, languageName) }
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
	);
}

export default ScriptEditor;