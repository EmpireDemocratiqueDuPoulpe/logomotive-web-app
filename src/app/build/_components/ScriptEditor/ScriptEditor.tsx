"use client";

import React from "react";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import Editor from "react-simple-code-editor";
import { languageName } from "@/utils/LogoInterpreter/LogoDefinition";
import styles from "./ScriptEditor.module.css";
import "@/sharedCSS/scriptEditor/scriptEditor.theme.css";
import "prismjs/themes/prism-tomorrow.min.css";

function ScriptEditor() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();

	/* --- Functions ----------------------------- */
	const handleScriptNameChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
		scriptEditorCtx.changeScriptName(event.target.value);
	};

	const handleScriptTagsChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
		scriptEditorCtx.changeScriptTags(event.target.value);
	};

	const handleScriptVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
		scriptEditorCtx.changeScriptPublicStatus(event.target.checked);
	};

	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptEditor}>
			{scriptEditorCtx.isLoading ? <p>Chargement en cours...</p> : (
				scriptEditorCtx.isLoadError ? null : (
					<>
						<div>
							<button onClick={scriptEditorCtx.executeScript}>Exécuter &gt;</button>

							<div>
								<input type="text" value={scriptEditorCtx.currentScript.name} onChange={handleScriptNameChange}/>
								<input type="text" value={scriptEditorCtx.currentScript.tags} onChange={handleScriptTagsChange}/>
								<label>
									public?
									<input type="checkbox" checked={scriptEditorCtx.currentScript.is_public} onChange={handleScriptVisibilityChange}/>
								</label>
								<button onClick={scriptEditorCtx.saveScript}>Sauvegarder</button>
							</div>

							<button onClick={scriptEditorCtx.downloadScript}>Télécharger</button>
						</div>


						<div className={styles.scriptEditorBox}>
							<Editor
								className={`${styles.editor} language-${languageName}`}
								textareaClassName={`${styles.codeArea} language-${languageName}`}
								preClassName={`${styles.codePre} language-${languageName}`}
								value={scriptEditorCtx.currentScript.content}
								onValueChange={scriptEditorCtx.changeScriptContent}
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
						</div>
					</>
				)
			)}
		</div>
	);
}

export default ScriptEditor;