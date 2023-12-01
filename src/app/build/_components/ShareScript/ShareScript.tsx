"use client";

import React from "react";
import useScriptSharingLink from "@/hooks/scriptSharingLinks/useScriptSharingLink";
import type { Props } from "./ShareScript.types";
import type { SharingLinkID } from "@/typings/global";
import type { JSONResponse } from "@/utils/Endpoint.types";
import toast from "react-hot-toast";

function ShareScript({ script_id }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const scriptSharingLink = useScriptSharingLink(null);

	/* --- Functions ----------------------------- */
	const onCreateClick = () : void => {
		scriptSharingLink.create.mutate({ script_id }, {
			onSuccess: (response: JSONResponse<SharingLinkID>) : void  => {
				navigator.clipboard.writeText(`${window.location.origin}/view/${response.data.link_id}`).catch(toast.error);
				toast.success("Lien copié dans le presse-papier");
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