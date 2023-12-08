import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import Modal from "@/components/Modal/Modal";

function ScriptEditorEditButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();
	const [isModalVisible, setModalVisible] = useState(false);

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

	const saveScript = (event: React.FormEvent) : void => {
		event.preventDefault();
		scriptEditorCtx.saveScript();
	};

	/* --- Component ----------------------------- */
	return (
		<>
			<button onClick={() => setModalVisible(true)}>
				<FontAwesomeIcon icon={scriptEditorCtx.currentScript.script_id ? faEdit : faSave}/>
			</button>

			{createPortal(
				<Modal isVisible={isModalVisible} setVisible={setModalVisible}>
					<form onSubmit={saveScript}>
						<label>
							Nom du script
							<input type="text" value={scriptEditorCtx.currentScript.name} onChange={handleScriptNameChange}/>
						</label>

						<label>
							Tags (séparé par des virgules)
							<input type="text" value={scriptEditorCtx.currentScript.tags} onChange={handleScriptTagsChange}/>
						</label>

						<label>
							Script public
							<input type="checkbox" checked={scriptEditorCtx.currentScript.is_public} onChange={handleScriptVisibilityChange}/>
						</label>

						<input type="submit" value="Sauvegarder"/>
					</form>
				</Modal>
				, document.body)
			}
		</>
	);
}

export default ScriptEditorEditButton;