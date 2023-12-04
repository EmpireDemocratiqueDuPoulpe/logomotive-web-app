"use client";

import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import useScripts from "@/hooks/scripts/useScripts";
import { bytesToHumanReadable } from "@/utils/files";
import { isoDateTimeToHumanReadable } from "@/utils/time";
import type { ScriptInfo } from "@/typings/global";
import type { Props } from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer.types";
import styles from "./ScriptsExplorer.module.css";

function isCurrentFile(currentScriptID: number, scriptID: number) : boolean {
	return (scriptID === currentScriptID);
}

function ScriptsExplorer({ script_id }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const scripts = useScripts();

	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptsExplorer}>
			<div className={styles.header}>
				<span>Nom du script</span>
				<span>Taille</span>
				<span>Crée le</span>
				<span>Mis à jour le</span>
			</div>

			{ scripts.isLoading ? <p>Chargement en cours...</p> : (
				scripts.isError ? null : (
					scripts.data?.data.scripts.map((script: ScriptInfo) : React.JSX.Element => (
						<Link
							key={script.script_id}
							className={clsx(styles.script, (isCurrentFile((script_id ?? -1), script.script_id) && styles.current))}
							href={`/build?scriptID=${script.script_id}`}
						>
							<span className={styles.scriptName}>
								<FontAwesomeIcon icon={faFileCode}/>
								{script.name}
							</span>

							<span className={styles.scriptSize}>{bytesToHumanReadable(script.fileSize)}</span>
							<span className={styles.scriptCreatedAt}>{isoDateTimeToHumanReadable(script.created_at)}</span>
							<span className={styles.scriptUpdatedAt}>{isoDateTimeToHumanReadable(script.updated_at)}</span>
						</Link>
					))
				)
			)}
		</div>
	);
}

export default ScriptsExplorer;