"use client";

import React, { useState } from "react";
import usePublicScripts from "@/hooks/scripts/usePublicScripts";
import type { PublicScript } from "@/typings/global";
import ScriptPreview from "@/app/explore/_components/ScriptPreview/ScriptPreview";

function Explore() : React.JSX.Element {
	/* --- States -------------------------------- */
	const publicScripts = usePublicScripts();
	const [ currentScriptID, setCurrentScriptID ] = useState<number | null>(null);

	/* --- Functions ----------------------------- */
	const handleScriptClick = (script: PublicScript) : void => {
		setCurrentScriptID(script.script_id);
	};

	/* --- Component ----------------------------- */
	return (
		<main>
			{publicScripts.isLoading ? <p>Chargement en cours...</p> : (
				publicScripts.isError ? <p>Erreur : {publicScripts.error.message}</p> : (
					<>
						{publicScripts.data?.data.scripts.map((script: PublicScript) : React.JSX.Element => (
							<button key={script.script_id} onClick={() => handleScriptClick(script)}>
								<b>{script.name}</b> par <em>{script.username}</em> {script.tags ? `[${script.tags?.join(", ")}]` : null}
							</button>
						))}

						{currentScriptID && <ScriptPreview scriptID={currentScriptID}/>}
					</>
				)
			)}
		</main>
	);
}

export default Explore;