"use client";

import React from "react";
import useScriptSharingLink from "@/hooks/scriptSharingLinks/useScriptSharingLink";
import ScriptPreview from "@/components/ScriptPreview/ScriptPreview";
import type { Props } from "./page.types";

function View({ params }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const script = useScriptSharingLink(params.linkID);

	/* --- Component ----------------------------- */
	return (
		<main>
			{script.isLoading ? <p>Chargement en cours...</p> : (
				script.isError ? null : (
					<>
						<ScriptPreview script={script.data!.data.script}/>
					</>
				)
			)}
		</main>
	);
}

export default View;