"use client";

import React, { useMemo } from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import useWindowSize from "@/hooks/windowSize/useWindowSize";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import { ScriptEditorProvider } from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import Box from "@/components/Box/Box";
import Console from "@/app/build/_components/Console/Console";
import Canvas from "@/app/build/_components/Canvas/Canvas";
import ScriptsExplorer from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer";
import ScriptEditor from "@/app/build/_components/ScriptEditor/ScriptEditor";
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
				<Box className={styles.canvasBox} width={`${canvasSize.width}px`} height={`${canvasSize.height}px`}>
					<Canvas width={canvasSize.width} height={canvasSize.height}/>
				</Box>

				<ScriptEditorProvider scriptID={scriptID ?? undefined}>
					<Box height={`${canvasSize.height}px`} header={(
						<Box.Header name="Éditeur">
							<ScriptEditor.ExecuteButton/>
							<ScriptEditor.SaveButton/>
							<ScriptEditor.EditButton/>
							<ScriptEditor.DownloadButton/>
							<ScriptEditor.ShareButton/>
						</Box.Header>
					)}>
						<ScriptEditor/>
					</Box>
				</ScriptEditorProvider>

				<Box width={`${canvasSize.width}px`} header={(
					<Box.Header name="Console">
						<Console.CleanBtn/>
					</Box.Header>
				)}>
					<Console/>
				</Box>

				<Box header={<Box.Header name="Explorateur de scripts"/>}>
					<ScriptsExplorer script_id={scriptID}/>
				</Box>
			</LogoBuilderProvider>
		</main>
	);
}

export default Build;