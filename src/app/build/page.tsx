import React from "react";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import Console from "@/app/build/_components/Console/Console";
import Canvas from "@/app/build/_components/Canvas/Canvas";

function Build() : React.JSX.Element {
	/* --- Component ----------------------------- */
	return (
		<main>
			<LogoBuilderProvider>
				<Console/>
				<Canvas/>
			</LogoBuilderProvider>
		</main>
	);
}

export default Build;