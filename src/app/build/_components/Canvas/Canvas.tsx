"use client";

import React, { useState, useLayoutEffect , useRef } from "react";
import clsx from "clsx";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import styles from "./Canvas.module.css";

function Canvas() : React.JSX.Element {
	/* --- States -------------------------------- */
	const logoBuilderCtx = useLogoBuilderContext();
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
	const canvasBoxRef = useRef(null);

	/* --- Effects ------------------------------- */
	useLayoutEffect(() : void => {
		setCanvasSize({ width: canvasBoxRef.current?.clientWidth, height: canvasBoxRef.current?.clientHeight });
	}, []);

	/* --- Component ----------------------------- */
	return (
		<div ref={canvasBoxRef} className={styles.canvasBox} style={{ width: "100%", height: "100%" }}>
			<span className={styles.canvasSize}>{canvasSize.width}x{canvasSize.height} (px)</span>

			<canvas
				ref={(node: HTMLCanvasElement | null) : void => { logoBuilderCtx.registerCanvas("draw", node); }}
				className={clsx(styles.canvas, styles.drawCanvas)}
			/>

			<canvas
				ref={(node: HTMLCanvasElement | null) : void => { logoBuilderCtx.registerCanvas("pointer", node); }}
				className={clsx(styles.canvas, styles.pointerCanvas)}
			/>
		</div>
	);
}

export default Canvas;