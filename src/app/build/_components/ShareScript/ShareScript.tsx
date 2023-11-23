"use client";

import React from "react";
import useMessageContext from "@/contexts/MessagesCtx/MessagesCtx";
import useScriptSharingLink from "@/hooks/scriptSharingLinks/useScriptSharingLink";
import type { Props } from "./ShareScript.types";
import type { SharingLinkID } from "@/typings/global";
import type { JSONResponse } from "@/utils/Endpoint.types";

function ShareScript({ script_id }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptSharingLink = useScriptSharingLink(null);
	const messages = useMessageContext();

	/* --- Functions ----------------------------- */
	const onCreateClick = () : void => {
		scriptSharingLink.create.mutate({ script_id }, {
			onSuccess: (response: JSONResponse<SharingLinkID>) : void  => {
				navigator.clipboard.writeText(response.data.link_id).catch(console.error);
				messages.add({ status: "success", message: "Lien copié dans le presse-papier" });
			}
		});
	};

	/* --- Component ----------------------------- */
	return (
		<div>
			<button onClick={onCreateClick}>Partager</button>
			<button>Voir les liens de partage</button>
		</div>
	);
}

export default ShareScript;