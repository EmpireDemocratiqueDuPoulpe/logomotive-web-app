import React from "react";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import Console from "@/app/build/_components/Console/Console";
import Canvas from "@/app/build/_components/Canvas/Canvas";
import ScriptsExplorer from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer";
import ScriptEditor from "@/app/build/_components/ScriptEditor/ScriptEditor";

function Build() : React.JSX.Element {
	/* --- Component ----------------------------- */
	return (
		<main>
			<LogoBuilderProvider>
				<Console/>
				<Canvas/>

				<ScriptsExplorer/>
				<ScriptEditor/>
			</LogoBuilderProvider>
		</main>
	);
}

export default Build;