import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import { Button } from "@nextui-org/react";

function ScriptEditorExecuteButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();

	/* --- Component ----------------------------- */
	return (
		<Button className="ml-auto bg-green-500 text-background dark:text-foreground" isIconOnly size="sm" onClick={scriptEditorCtx.executeScript}>
			<FontAwesomeIcon icon={faPlay}/>
		</Button>
	);
}

export default ScriptEditorExecuteButton;