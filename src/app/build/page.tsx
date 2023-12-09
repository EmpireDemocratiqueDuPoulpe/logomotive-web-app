"use client";

import React, { useMemo } from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import useAuthContext from "@/contexts/AuthCtx/AuthCtx";
import useScripts from "@/hooks/scripts/useScripts";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import { ScriptEditorProvider } from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import Console from "@/app/build/_components/Console/Console";
import Canvas from "@/app/build/_components/Canvas/Canvas";
import ScriptsExplorer from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer";
import ScriptEditor from "@/components/ScriptEditor/ScriptEditor";
import {Card, CardHeader, CardBody, CardFooter, Spinner} from "@nextui-org/react";
import styles from "./page.module.css";

const SCRIPT_ID_PARAM: string = "scriptID";

function getScriptID(searchParams: ReadonlyURLSearchParams) : number | null {
	return searchParams.has(SCRIPT_ID_PARAM) ? parseInt(searchParams.get(SCRIPT_ID_PARAM)!, 10) : null;
}

function Build() : React.JSX.Element {
	/* --- States -------------------------------- */
	const authContext = useAuthContext();
	const searchParams = useSearchParams();
	const scriptID: number | null = useMemo(() => getScriptID(searchParams), [searchParams]);
	const scripts = useScripts({ enabled: (authContext.status === "connected") });

	/* --- Component ----------------------------- */
	return (
		<main className={styles.page}>
			<LogoBuilderProvider>
				<Card className="border-1 border-default-50">
					<Canvas/>
				</Card>

				<ScriptEditorProvider scriptID={scriptID ?? undefined}>
					<Card>
						<CardHeader>
							<span className="text-sm">&Eacute;diteur</span>

							<ScriptEditor.ExecuteButton/>
							{authContext.status === "connected" && (
								<>
									<ScriptEditor.SaveButton/>
									<ScriptEditor.EditButton/>
								</>
							)}
							<ScriptEditor.NewButton/>
							<ScriptEditor.DownloadButton/>
							{authContext.status === "connected" && (
								<ScriptEditor.ShareButton/>
							)}
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

					<CardBody className="relative">
						{authContext.status !== "connected" ? (
							<p className="text-sm text-default-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Veuillez vous connecter pour utiliser cette fonctionnalité.</p>
						) : (
							scripts.isLoading ? <Spinner className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2"/> : (
								scripts.isError ? null : (
									<ScriptsExplorer script_id={scriptID!} scripts={scripts.data!.data.scripts}/>
								)
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