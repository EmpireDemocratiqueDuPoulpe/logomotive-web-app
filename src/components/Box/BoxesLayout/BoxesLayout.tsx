import React from "react";
import type { Props } from "./BoxesLayout.types";
import styles from "./BoxesLayout.module.css";

function BoxesLayout({ direction, children }: Props) : React.JSX.Element {
	/* --- Component ----------------------------- */
	return (
		<div className={styles.boxesLayout} style={{ flexDirection: direction }}>
			{children}
		</div>
	);
}

export default BoxesLayout;