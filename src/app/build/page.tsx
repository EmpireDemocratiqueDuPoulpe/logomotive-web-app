"use client";

import React, { useMemo } from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import useWindowSize from "@/hooks/windowSize/useWindowSize";
import useScripts from "@/hooks/scripts/useScripts";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import { ScriptEditorProvider } from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import Console from "@/app/build/_components/Console/Console";
import Canvas from "@/app/build/_components/Canvas/Canvas";
import ScriptsExplorer from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer";
import ScriptEditor from "@/app/build/_components/ScriptEditor/ScriptEditor";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
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
		{ width: Math.floor(windowSize.width / 2), height: Math.floor(windowSize.height / 2.025) }
	), [windowSize]);
	const scripts = useScripts();

	/* --- Component ----------------------------- */
	return (
		<main className={styles.page}>
			<LogoBuilderProvider>
				<Card className="border-1 border-default-50">
					<Canvas width={canvasSize.width} height={canvasSize.height}/>
				</Card>

				<ScriptEditorProvider scriptID={scriptID ?? undefined}>
					<Card>
						<CardHeader>
							<span className="text-sm">&Eacute;diteur</span>

							<ScriptEditor.ExecuteButton/>
							<ScriptEditor.SaveButton/>
							<ScriptEditor.EditButton/>
							<ScriptEditor.DownloadButton/>
							<ScriptEditor.ShareButton/>
						</CardHeader>

						<ScriptEditor/>
					</Card>
				</ScriptEditorProvider>

				<Card>
					<CardHeader>
						<span className="text-sm">Console</span>

						<Console.CleanBtn/>
					</CardHeader>

					<CardBody>
						<Console/>
					</CardBody>
				</Card>

				<Card>
					<CardHeader>
						<span className="text-sm">Explorateur de scripts</span>
					</CardHeader>

					<CardBody>
						{scripts.isLoading ? <p>Chargement en cours...</p> : (
							scripts.isError ? null : (
								<ScriptsExplorer script_id={scriptID!} scripts={scripts.data!.data.scripts}/>
							)
						)}
					</CardBody>

					<CardFooter>
						<span className="text-xs">{scripts.data?.data.scripts.length ? `${scripts.data?.data.scripts.length} fichier(s)` : null}</span>
					</CardFooter>
				</Card>
			</LogoBuilderProvider>
		</main>
	);
}

export default Build;