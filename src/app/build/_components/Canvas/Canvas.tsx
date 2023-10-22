"use client";

import React, { useMemo } from "react";
import clsx from "clsx";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import type { Props } from "./Canvas.types";
import styles from "./Canvas.module.css";

function Canvas({ width = 1000, height = 600 }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const logoBuilderCtx = useLogoBuilderContext();

	/* --- Component ----------------------------- */
	return (
		<div className={styles.canvasBox} style={{ width: `${width}px`, height: `${height}px` }}>
			<span className={styles.canvasSize}>{width}x{height} (px)</span>

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