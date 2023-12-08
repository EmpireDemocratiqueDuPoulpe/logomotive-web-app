import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";

function ScriptEditorSaveButton() : React.JSX.Element | null {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();

	/* --- Component ----------------------------- */
	return !scriptEditorCtx.currentScript.script_id ? null : (
		<button className="primaryColor icon" onClick={scriptEditorCtx.saveScript}>
			<FontAwesomeIcon icon={faSave}/>
		</button>
	);
}

export default ScriptEditorSaveButton;