"use client";

import React from "react";
import Link from "next/link";
import useScripts from "@/hooks/scripts/useScripts";
import { bytesToHumanReadable } from "@/utils/files";
import type { ScriptInfo } from "@/typings/global";
import styles from "./ScriptsExplorer.module.css";

function ScriptsExplorer() : React.JSX.Element {
	/* --- States -------------------------------- */
	const scripts = useScripts();

	/* --- Functions ----------------------------- */

	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptsExplorer}>
			{ scripts.isLoading ? <p>Chargement...</p> : (
				scripts.isError ? <p>Erreur : {scripts.error.message}</p> : (
					scripts.data?.data.scripts.map((script: ScriptInfo) : React.JSX.Element => (
						<Link key={script.script_id} href={`/build?scriptID=${script.script_id}`}>{script.name} - {bytesToHumanReadable(script.fileSize)}</Link>
					))
				)
			)}
		</div>
	);
}

export default ScriptsExplorer;