"use client";

import React, {useEffect, useState} from "react";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import type { ScriptError, ScriptReturn } from "@/utils/LogoInterpreter/LogoInterpreter.types";
import useScript from "@/hooks/scripts/useScript";
import Editor from "react-simple-code-editor";
import Prism, { languageName } from "@/utils/LogoInterpreter/LogoDefinition";
import styles from "./ScriptEditor.module.css";
import "./ScriptEditor.theme.css";
import "prismjs/themes/prism-tomorrow.min.css";
import { useRouter, useSearchParams } from "next/navigation";


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
	const router = useRouter();
	const searchParams = useSearchParams();
	const logoBuilderCtx = useLogoBuilderContext();
	const script = useScript(searchParams.has("scriptID") ? parseInt(searchParams.get("scriptID")!, 10) : null);
	const [ scriptName, setScriptName ] = useState<string>("");
	const [ scriptContent, setScriptContent ] = useState<string>("");
	const [ errors, setErrors ] = useState<ScriptError[]>([]);

	/* --- Functions ----------------------------- */
	const handleScriptNameChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
		setScriptName(event.target.value);
	};

	const executeScript = () : void => {
		const scriptReturn: ScriptReturn = logoBuilderCtx.interpreter.executeScript(scriptContent);

		if (scriptReturn.status === "failed") {
			setErrors(scriptReturn.errors);
		}
	};

	const saveScript = () : void => {
		script.create.mutate({ name: scriptName, content: scriptContent }, {
			onSuccess: ({ data: {script_id} }) : void => {
				router.replace(`/build?scriptID=${script_id}`);
			}
		});
	};

	useEffect(() : void => {
		if (script.data?.data) {
			setScriptName(script.data.data.script.name);
			setScriptContent(script.data.data.script.content);
		}
	}, [script.isSuccess]);

	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptEditor}>
			{script.isLoading ? <p>Chargement en cours...</p> : (
				script.isError ? <p>Erreur: {script.error.message}</p> : (
					<>
						<div>
							<button onClick={executeScript}>Exécuter &gt;</button>

							<div>
								<input type="text" value={scriptName} onChange={handleScriptNameChange}/>
								<button onClick={saveScript}>Sauvegarder</button>
							</div>
						</div>


						<div className={styles.scriptEditorBox}>
							<Editor
								className={`${styles.editor} language-${languageName}`}
								textareaClassName={`${styles.codeArea} language-${languageName}`}
								preClassName={`${styles.codePre} language-${languageName}`}
								value={scriptContent}
								onValueChange={setScriptContent}
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
					</>
				)
			)}
		</div>
	);
}

export default ScriptEditor;