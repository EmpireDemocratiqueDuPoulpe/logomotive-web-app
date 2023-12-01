"use client";

import React from "react";
import Link from "next/link";
import useScripts from "@/hooks/scripts/useScripts";
import { bytesToHumanReadable } from "@/utils/files";
import type { ScriptInfo } from "@/typings/global";
import type { Props } from "@/app/build/_components/ScriptsExplorer/ScriptsExplorer.types";
import styles from "./ScriptsExplorer.module.css";

function ScriptsExplorer({ script_id }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const scripts = useScripts();

	/* --- Component ----------------------------- */
	return (
		<div className={styles.scriptsExplorer}>
			{ scripts.isLoading ? <p>Chargement...</p> : (
				scripts.isError ? null : (
					scripts.data?.data.scripts.map((script: ScriptInfo) : React.JSX.Element => (
						<Link key={script.script_id} href={`/build?scriptID=${script.script_id}`}>
							{(script.script_id === script_id) && "[C] "}{script.name} - {bytesToHumanReadable(script.fileSize)}
						</Link>
					))
				)
			)}
		</div>
	);
}

export default ScriptsExplorer;