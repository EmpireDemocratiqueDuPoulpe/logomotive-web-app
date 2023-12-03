import React from "react";
import BoxesLayout from "@/components/Box/BoxesLayout/BoxesLayout";
import type { Props } from "@/components/Box/Box.types";
import styles from "./Box.module.css";

function Box({ width, height, children }: Props) : React.JSX.Element {
	/* --- Component ----------------------------- */
	return (
		<div className={styles.box} style={{ width: width ?? "auto", height: height ?? "auto" }}>
			{children}
		</div>
	);
}
Box.Layout = BoxesLayout;

export default Box;