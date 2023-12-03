import React from "react";
import clsx from "clsx";
import BoxesLayout from "@/components/Box/BoxesLayout/BoxesLayout";
import BoxHeader from "@/components/Box/BoxHeader/BoxHeader";
import type { Props } from "@/components/Box/Box.types";
import styles from "./Box.module.css";

function Box({ className, width, height, children }: Props) : React.JSX.Element {
	/* --- Component ----------------------------- */
	return (
		<div className={clsx(styles.box, className)} style={{ width: width ?? "auto", height: height ?? "auto" }}>
			{children}
		</div>
	);
}
Box.Layout = BoxesLayout;
Box.Header = BoxHeader;

export default Box;