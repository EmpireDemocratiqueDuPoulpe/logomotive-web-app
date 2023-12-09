import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import { Button } from "@nextui-org/react";

function ScriptEditorDownloadButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();

	/* --- Component ----------------------------- */
	return (
		<Button className="ml-5" isIconOnly size="sm" onClick={scriptEditorCtx.downloadScript}>
			<FontAwesomeIcon icon={faDownload}/>
		</Button>
	);
}

export default ScriptEditorDownloadButton;