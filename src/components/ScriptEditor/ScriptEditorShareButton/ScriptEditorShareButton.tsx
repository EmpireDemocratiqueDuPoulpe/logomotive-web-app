import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import useScriptSharingLink from "@/hooks/scriptSharingLinks/useScriptSharingLink";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import type { SharingLinkID} from "@/typings/global";
import type { JSONResponse } from "@/utils/Endpoint.types";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader, Spinner,
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	useDisclosure
} from "@nextui-org/react";
import toast from "react-hot-toast";
import {createPortal} from "react-dom";
import useScriptSharingLinks from "@/hooks/scriptSharingLinks/useScriptSharingLinks";

function ScriptEditorShareButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();
	const scriptSharingLink = useScriptSharingLink(null);
	const scriptSharingLinks = useScriptSharingLinks(scriptEditorCtx.currentScript.script_id ?? null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	/* --- Functions ----------------------------- */
	const onCreateClick = () : void => {
		if (!scriptEditorCtx.currentScript.script_id) return;

		scriptSharingLink.create.mutate({ script_id: scriptEditorCtx.currentScript.script_id }, {
			onSuccess: (response: JSONResponse<SharingLinkID>) : void  => {
				navigator.clipboard.writeText(`${window.location.origin}/view/${response.data.link_id}`).catch(toast.error);
				toast.success("Lien copié dans le presse-papier");
			}
		});
	};

	const onCopyLink = (link_id: string) : void => {
		navigator.clipboard.writeText(`${window.location.origin}/view/${link_id}`).catch(toast.error);
		toast.success("Lien copié dans le presse-papier.");
	};

	const onDeleteClick = (link_id: string) : void => {
		scriptSharingLink.delete.mutate({ link_id }, {
			onSuccess: () : void  => {
				toast.success("Lien supprimé.");
			}
		});
	};

	/* --- Component ----------------------------- */
	return (
		<>
			<Button className="ml-5 mr-1" isIconOnly size="sm" onClick={onCreateClick} disabled={!scriptEditorCtx.currentScript.script_id}>
				<FontAwesomeIcon icon={faShare}/>
			</Button>

			<Button size="sm" onClick={onOpen} disabled={!scriptEditorCtx.currentScript.script_id}>
				Voir les liens de partage
			</Button>

			{createPortal(
				<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">Liens de partage</ModalHeader>

								<ModalBody>
									{scriptSharingLinks.isLoading ? <Spinner/> : (
										scriptSharingLinks.isError ? null : (
											<Table aria-label="Table des liens de partage">
												<TableHeader>
													<TableColumn>LIEN</TableColumn>
													<TableColumn>ACTIONS</TableColumn>
												</TableHeader>

												<TableBody>
													{scriptSharingLinks.data!.data.links.map((link: string) => (
														<TableRow key={link}>
															<TableCell>{link}</TableCell>

															<TableCell className="flex flex-row">
																<Button variant="light" onPress={() => onCopyLink(link)} isIconOnly>
																	<FontAwesomeIcon icon={faCopy}/>
																</Button>

																<Button color="danger" variant="light" onPress={() => onDeleteClick(link)} isIconOnly>
																	<FontAwesomeIcon icon={faTrash}/>
																</Button>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										)
									)}
								</ModalBody>

								<ModalFooter>
									<Button color="danger" variant="light" onPress={onClose}>
										Fermer
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

export default ScriptEditorShareButton;