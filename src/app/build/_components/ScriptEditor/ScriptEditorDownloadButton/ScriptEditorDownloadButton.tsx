import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";

function ScriptEditorDownloadButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();

	/* --- Component ----------------------------- */
	return (
		<button onClick={scriptEditorCtx.downloadScript}>
			<FontAwesomeIcon icon={faDownload}/>
		</button>
	);
}

export default ScriptEditorDownloadButton;