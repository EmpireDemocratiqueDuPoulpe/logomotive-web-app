"use client";

import React, { useState } from "react";
import usePublicScripts from "@/hooks/scripts/usePublicScripts";
import useScript from "@/hooks/scripts/useScript";
import type { PublicScript } from "@/typings/global";
import ScriptPreview from "@/components/ScriptPreview/ScriptPreview";

function Explore() : React.JSX.Element {
	/* --- States -------------------------------- */
	const publicScripts = usePublicScripts();
	const [ currentScriptID, setCurrentScriptID ] = useState<number | null>(null);
	const currentScript = useScript(currentScriptID);

	/* --- Functions ----------------------------- */
	const handleScriptClick = (script: PublicScript) : void => {
		setCurrentScriptID(script.script_id);
	};

	/* --- Component ----------------------------- */
	return (
		<main>
			{publicScripts.isLoading ? <p>Chargement en cours...</p> : (
				publicScripts.isError ? null : (
					<>
						{publicScripts.data?.data.scripts.map((script: PublicScript) : React.JSX.Element => (
							<button key={script.script_id} onClick={() => handleScriptClick(script)}>
								<b>{script.name}</b> par <em>{script.username}</em> {script.tags ? `[${script.tags?.join(", ")}]` : null}
							</button>
						))}

						{(currentScript.isSuccess && currentScript.data) && <ScriptPreview script={currentScript.data.data.script}/>}
					</>
				)
			)}
		</main>
	);
}

export default Explore;