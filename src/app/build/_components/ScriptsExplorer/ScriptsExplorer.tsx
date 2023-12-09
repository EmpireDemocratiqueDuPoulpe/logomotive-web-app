"use client";

import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import { bytesToHumanReadable } from "@/utils/files";
import { isoDateTimeToHumanReadable } from "@/utils/time";
import type { ScriptInfo } from "@/typings/global";
import type { Props } from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer.types";
import styles from "./ScriptsExplorer.module.css";

function isCurrentFile(currentScriptID: number, scriptID: number) : boolean {
	return (scriptID === currentScriptID);
}

function ScriptsExplorer({ script_id, scripts }: Props) : React.JSX.Element {
	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptsExplorer}>
			<div className={styles.header}>
				<span>Nom du script</span>
				<span>Taille</span>
				<span>Crée le</span>
				<span>Mis à jour le</span>
			</div>

			{scripts.map((script: ScriptInfo) : React.JSX.Element => (
				<Link
					key={script.script_id}
					className={clsx(
						styles.script,
						(isCurrentFile((script_id ?? -1), script.script_id)
							? "bg-default-300 dark:bg-default-200"
							: "hover:bg-default-200 dark:hover:bg-default-100"
						),

					)}
					href={`/build?scriptID=${script.script_id}`}
				>
					<span className={styles.scriptName}>
						<FontAwesomeIcon className="text-secondary" icon={faFileCode}/>
						{script.name}
					</span>

					<span className={clsx(styles.scriptSize, "text-default-500")}>
						{bytesToHumanReadable(script.fileSize)}
					</span>

					<span className={clsx(styles.scriptCreatedAt, "text-default-500")}>
					      {isoDateTimeToHumanReadable(script.created_at)}
					</span>

					<span className={clsx(styles.scriptUpdatedAt, "text-default-500")}>
						{isoDateTimeToHumanReadable(script.updated_at)}
					</span>
				</Link>
			))}
		</div>
	);
}

export default ScriptsExplorer;