import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";

function ScriptEditorExecuteButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();

	/* --- Component ----------------------------- */
	return (
		<button onClick={scriptEditorCtx.executeScript}>
			<FontAwesomeIcon icon={faPlay}/>
		</button>
	);
}

export default ScriptEditorExecuteButton;