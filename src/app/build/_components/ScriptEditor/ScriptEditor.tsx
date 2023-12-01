"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import type { ScriptError, ScriptReturn } from "@/utils/LogoInterpreter/LogoInterpreter.types";
import useScript from "@/hooks/scripts/useScript";
import Editor from "react-simple-code-editor";
import Prism, { languageName } from "@/utils/LogoInterpreter/LogoDefinition";
import { downloadTextFile } from "@/utils/files";
import { Props } from "@/app/build/_components/ScriptEditor/ScriptEditor.types";
import styles from "./ScriptEditor.module.css";
import "@/sharedCSS/scriptEditor/scriptEditor.theme.css";
import "prismjs/themes/prism-tomorrow.min.css";
import toast from "react-hot-toast";

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

function ScriptEditor({ script_id }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const router = useRouter();

	const logoBuilderCtx = useLogoBuilderContext();
	const [ scriptName, setScriptName ] = useState<string>("");
	const [ scriptContent, setScriptContent ] = useState<string>("");
	const [ scriptTags, setScriptTags ] = useState<string>("");
	const [ scriptIsPublic, setScriptPublic ] = useState<boolean>(false);
	const script = useScript(script_id);
	const [ errors, setErrors ] = useState<ScriptError[]>([]);

	/* --- Functions ----------------------------- */
	const handleScriptNameChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
		setScriptName(event.target.value);
	};

	const handleScriptTagsChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
		setScriptTags(event.target.value);
	};

	const handleScriptVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
		setScriptPublic(event.target.checked);
	};

	const executeScript = () : void => {
		const scriptReturn: ScriptReturn = logoBuilderCtx.interpreter.executeScript(scriptContent);

		if (scriptReturn.status === "failed") {
			setErrors(scriptReturn.errors);
		} else setErrors([]);
	};

	const saveScript = () : void => {
		const newScriptData = {
			name: scriptName,
			content: scriptContent,
			tags: scriptTags.split(","),
			is_public: scriptIsPublic
		};
		
		toast.promise(new Promise<void>((resolve, reject) : void => {
			if (script_id) {
				script.update.mutate({ ...newScriptData, script_id }, {
					onSuccess: () => resolve(),
					onError: (error: unknown) => reject(error),
				});
			} else {
				script.create.mutate(newScriptData, {
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
	};

	const downloadScript = () : void => {
		downloadTextFile("script.logo", scriptContent);
	};

	/* --- Effects ------------------------------- */
	useEffect(() : void => {
		if (script.data?.data) {
			setScriptName(script.data.data.script.name);
			setScriptContent(script.data.data.script.content);
			setScriptTags(script.data.data.script.tags?.join(",") ?? "");
			setScriptPublic(script.data.data.script.is_public);
		}
		// We only want to update the script editor when the data is updated.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [script.dataUpdatedAt]);

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
								<input type="text" value={scriptTags} onChange={handleScriptTagsChange}/>
								<label>
									public?
									<input type="checkbox" checked={scriptIsPublic} onChange={handleScriptVisibilityChange}/>
								</label>
								<button onClick={saveScript}>Sauvegarder</button>
							</div>

							<button onClick={downloadScript}>Télécharger</button>
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