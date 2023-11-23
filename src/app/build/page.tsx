"use client";

import React, { useMemo } from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import Console from "@/app/build/_components/Console/Console";
import Canvas from "@/app/build/_components/Canvas/Canvas";
import ScriptsExplorer from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer";
import ScriptEditor from "@/app/build/_components/ScriptEditor/ScriptEditor";
import ShareScript from "@/app/build/_components/ShareScript/ShareScript";

const SCRIPT_ID_PARAM: string = "scriptID";

function getScriptID(searchParams: ReadonlyURLSearchParams) : number | null {
	return searchParams.has(SCRIPT_ID_PARAM) ? parseInt(searchParams.get(SCRIPT_ID_PARAM)!, 10) : null;
}

function Build() : React.JSX.Element {
	/* --- States -------------------------------- */
	const searchParams = useSearchParams();
	const scriptID: number | null = useMemo(() => getScriptID(searchParams), [searchParams]);

	/* --- Component ----------------------------- */
	return (
		<main>
			<LogoBuilderProvider>
				<Console/>
				<Canvas/>

				{scriptID && <ShareScript script_id={scriptID}/>}
				<ScriptsExplorer script_id={scriptID}/>
				<ScriptEditor script_id={scriptID}/>
			</LogoBuilderProvider>
		</main>
	);
}

export default Build;