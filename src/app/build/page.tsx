import React from "react";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import Console from "@/app/build/_components/Console/Console";
import Canvas from "@/app/build/_components/Canvas/Canvas";
import ScriptsExplorer from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer";
import ScriptEditor from "@/app/build/_components/ScriptEditor/ScriptEditor";
import ShareScript from "@/app/build/_components/ShareScript/ShareScript";
import {useSearchParams} from "next/navigation";

function Build() : React.JSX.Element {
	/* --- States -------(((---------------------- */
	const searchParams = useSearchParams();

	/* --- Component ----------------------------- */
	return (
		<main>
			<LogoBuilderProvider>
				<Console/>
				<Canvas/>

				<ShareScript script_id={sc}/>
				<ScriptsExplorer/>
				<ScriptEditor/>
			</LogoBuilderProvider>
		</main>
	);
}

export default Build;