"use client";

import React from "react";
import useScriptSharingLink from "@/hooks/scriptSharingLinks/useScriptSharingLink";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import { ScriptEditorProvider } from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import ScriptEditor from "@/components/ScriptEditor/ScriptEditor";
import Canvas from "@/app/build/_components/Canvas/Canvas";
import {Card, CardHeader, Link, Spinner} from "@nextui-org/react";
import type { Props } from "./page.types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

function View({ params }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const script = useScriptSharingLink(params.linkID);

	/* --- Component ----------------------------- */
	return (
		<main className="h-full">
			<LogoBuilderProvider>
				{script.isLoading ? <Spinner className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2"/> : (
					script.isError ? null : (
						<div className="flex flex-row items-stretch justify-start h-full p-4 gap-4">
							<div className="grow">
								<Link className="mb-1" style={{ fontSize: "0.8em" }} href="/" isBlock>
									<FontAwesomeIcon className="mr-1" icon={faArrowLeft}/>
									Retour
								</Link>

								<ScriptEditorProvider scriptID={script.data?.data.script.script_id ?? undefined}>
									<Card>
										<CardHeader>
											<span className="text-sm">&Eacute;diteur</span>

											<ScriptEditor.ExecuteButton/>
											<ScriptEditor.DownloadButton/>
										</CardHeader>

										<ScriptEditor/>
									</Card>
								</ScriptEditorProvider>
							</div>

							<div className="grow">
								<Card fullWidth className="h-full border-1 border-default-50">
									<Canvas/>
								</Card>
							</div>
						</div>
					)
				)}
			</LogoBuilderProvider>
		</main>
	);
}

export default View;