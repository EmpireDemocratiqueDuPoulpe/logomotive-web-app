"use client";

import React from "react";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import styles from "./Canvas.module.css";

function Canvas() : React.JSX.Element {
	/* --- States -------------------------------- */
	const logoBuilderCtx = useLogoBuilderContext();

	/* --- Component ----------------------------- */
	return (
		<div className={styles.canvasBox}>
			<canvas ref={logoBuilderCtx.registerCanvas} className={styles.canvas}/>
		</div>
	);
}

export default Canvas;