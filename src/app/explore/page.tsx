"use client";

import React, { useState } from "react";
import usePublicScripts from "@/hooks/scripts/usePublicScripts";
import type { PublicScript } from "@/typings/global";
import { LogoBuilderProvider } from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import { ScriptEditorProvider } from "@/contexts/ScriptEditorCtx/ScriptEditorCtx";
import ScriptEditor from "@/components/ScriptEditor/ScriptEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import {Avatar, Card, CardBody, CardFooter, Input, Accordion, AccordionItem, Spinner} from "@nextui-org/react";
import {isoDateTimeToHumanReadable} from "@/utils/time";
import Canvas from "@/app/build/_components/Canvas/Canvas";
import { useDebounce } from "usehooks-ts";

function Explore() : React.JSX.Element {
	/* --- States -------------------------------- */
	const publicScripts = usePublicScripts();
	const [ search, setSearch ] = useState<string>("");
	const debouncedSearch: string = useDebounce(search, 300);

	/* --- Component ----------------------------- */
	return (
		<main className="h-full">
			<LogoBuilderProvider>
				{publicScripts.isLoading ? <Spinner className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2"/> : (
					publicScripts.isError ? null : (
						<div className="flex flex-row items-stretch justify-start h-full p-4 gap-4">
							<div className="grow">
								<Input
									label="Rechercher"
									placeholder="Rechercher des tags..."
									description="Séparer par des virgules"
									startContent={<FontAwesomeIcon icon={faSearch}/>}
									isClearable
									className="mb-4"
									value={search}
									onValueChange={setSearch}
									onClear={() => setSearch("")}
								/>

								{(() => {
									const filters: string[] | null = debouncedSearch
										? debouncedSearch.split(",").map(s => s.trim())
										: null;

									return (publicScripts.data?.data.scripts
										.filter((s: PublicScript) : boolean => filters ? (s.tags?.some(t => filters.some(f => t.includes(f))) ?? false) : true)
										.map((script: PublicScript) : React.JSX.Element => (
											<Card key={script.script_id} className="mb-4 last:mb-0">
												<CardBody>
													<Accordion>
														<AccordionItem
															key="1"
															aria-label={script.name}
															title={script.name}
															subtitle={<span className="text-small tracking-tight text-default-400">{script.tags ? `[${script.tags?.join(", ")}]` : null}</span>}
														>
															<ScriptEditorProvider scriptID={script.script_id ?? undefined}>
																<div>
																	<ScriptEditor.ExecuteButton/>
																	<ScriptEditor.DownloadButton/>
																</div>

																<ScriptEditor editable={false}/>
															</ScriptEditorProvider>
														</AccordionItem>
													</Accordion>
												</CardBody>

												<CardFooter>
													<div className="flex gap-5">
														<Avatar name={script.username} isBordered radius="full" size="sm"/>

														<div className="flex flex-col gap-1 items-start justify-center">
															<h4 className="text-xs font-semibold leading-none text-default-600">{script.username}</h4>
															<h5 className="text-xs tracking-tight text-default-400">Créé le {isoDateTimeToHumanReadable(script.created_at)}</h5>
														</div>
													</div>
												</CardFooter>
											</Card>
										)));
								})()}
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

export default Explore;