import React from "react";
import type { Props } from "./BoxHeader.types";
import styles from "./BoxHeader.module.css";

function BoxHeader({ name, children }: Props) : React.JSX.Element {
	/* --- Component ----------------------------- */
	return (
		<div className={styles.boxHeaderWrapper}>
			<div className={styles.boxHeader}>
				{name && <span>{name}</span>}
				{children}
			</div>
		</div>
	);
}

export default BoxHeader;