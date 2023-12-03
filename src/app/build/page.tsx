"use client";

import React, { useMemo } from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import useWindowSize from "@/hooks/windowSize/useWindowSize";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import Box from "@/components/Box/Box";
import Console from "@/app/build/_components/Console/Console";
import Canvas from "@/app/build/_components/Canvas/Canvas";
import ScriptsExplorer from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer";
import ScriptEditor from "@/app/build/_components/ScriptEditor/ScriptEditor";
import ShareScript from "@/app/build/_components/ShareScript/ShareScript";
import styles from "./page.module.css";

const SCRIPT_ID_PARAM: string = "scriptID";

function getScriptID(searchParams: ReadonlyURLSearchParams) : number | null {
	return searchParams.has(SCRIPT_ID_PARAM) ? parseInt(searchParams.get(SCRIPT_ID_PARAM)!, 10) : null;
}

function Build() : React.JSX.Element {
	/* --- States -------------------------------- */
	const searchParams = useSearchParams();
	const windowSize = useWindowSize();
	const scriptID: number | null = useMemo(() => getScriptID(searchParams), [searchParams]);
	const canvasSize: { width: number, height: number } = useMemo(() => (
		{ width: Math.floor(windowSize.width / 2), height: Math.floor(windowSize.height / 2) }
	), [windowSize]);

	/* --- Component ----------------------------- */
	return (
		<main className={styles.page}>
			<LogoBuilderProvider>

				<Box width={`${canvasSize.width}px`} height={`${canvasSize.height}px`}>
					<Canvas width={canvasSize.width} height={canvasSize.height}/>
				</Box>

				<Box height={`${canvasSize.height}px`}>
					{scriptID && <ShareScript script_id={scriptID}/>}
					<ScriptEditor script_id={scriptID}/>
				</Box>

				<Box width={`${canvasSize.width}px`}>
					<Console/>
				</Box>

				<Box>
					<ScriptsExplorer script_id={scriptID}/>
				</Box>
			</LogoBuilderProvider>
		</main>
	);
}

export default Build;