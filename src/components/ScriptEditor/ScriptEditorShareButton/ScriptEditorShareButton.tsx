import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import useScriptSharingLink from "@/hooks/scriptSharingLinks/useScriptSharingLink";
import useScriptEditorContext from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import type { SharingLinkID } from "@/typings/global";
import type { JSONResponse } from "@/utils/Endpoint.types";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";

function ScriptEditorShareButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptEditorCtx = useScriptEditorContext();
	const scriptSharingLink = useScriptSharingLink(null);

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

	/* --- Component ----------------------------- */
	return (
		<>
			<Button className="ml-5 mr-1" isIconOnly size="sm" onClick={onCreateClick} disabled={!scriptEditorCtx.currentScript.script_id}>
				<FontAwesomeIcon icon={faShare}/>
			</Button>

			<Button size="sm" disabled={/*!scriptEditorCtx.currentScript.script_id*/ true}>
				Voir les liens de partage
			</Button>
		</>
	);
}

export default ScriptEditorShareButton;