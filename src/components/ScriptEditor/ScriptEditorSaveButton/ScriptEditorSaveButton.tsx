import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import { Button } from "@nextui-org/react";

function ScriptEditorSaveButton() : React.JSX.Element | null {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();

	/* --- Component ----------------------------- */
	return !scriptEditorCtx.currentScript.script_id ? null : (
		<Button className="ml-1 bg-secondary text-background dark:text-foreground" isIconOnly size="sm" onClick={scriptEditorCtx.saveScript}>
			<FontAwesomeIcon icon={faSave}/>
		</Button>
	);
}

export default ScriptEditorSaveButton;