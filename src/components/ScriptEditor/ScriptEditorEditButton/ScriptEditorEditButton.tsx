import React from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faEdit } from "@fortawesome/free-solid-svg-icons";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import {
	Button,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Input,
	Checkbox
} from "@nextui-org/react";

function ScriptEditorEditButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	/* --- Functions ----------------------------- */
	const saveScript = (onClose: () => void) : void => {
		scriptEditorCtx.saveScript();
		onClose();
	};

	/* --- Component ----------------------------- */
	return (
		<>
			<Button className={clsx("ml-5", (!scriptEditorCtx.currentScript.script_id && "bg-secondary text-background dark:text-foreground"))} isIconOnly size="sm" onPress={onOpen}>
				<FontAwesomeIcon icon={scriptEditorCtx.currentScript.script_id ? faEdit : faSave}/>
			</Button>

			{createPortal(
				<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">Informations du script</ModalHeader>

								<ModalBody>
									<Input
										type="text"
										label="Nom du script"
										value={scriptEditorCtx.currentScript.name}
										onValueChange={scriptEditorCtx.changeScriptName}
										isRequired
									/>

									<Input
										type="text"
										label="Tags"
										description="Séparer chaque tag par une virgule (,)."
										value={scriptEditorCtx.currentScript.tags}
										onValueChange={scriptEditorCtx.changeScriptTags}
										isClearable
									/>

									<Checkbox
										isSelected={scriptEditorCtx.currentScript.is_public}
										onValueChange={scriptEditorCtx.changeScriptPublicStatus}
									>
										Rendre public
									</Checkbox>
								</ModalBody>

								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
										Fermer
									</Button>

									<Button color="primary" onPress={() => saveScript(onClose)}>
										Sauvegarder
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
				, document.body)
			}
		</>
	);
}

export default ScriptEditorEditButton;