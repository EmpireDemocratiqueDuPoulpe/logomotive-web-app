import React, {useEffect, useRef} from "react";
import clsx from "clsx";
import type { Props } from "./ConsoleHistory.types";
import styles from "./ConsoleHistory.module.css";

function ConsoleHistory({ history }: Props) : React.JSX.Element {
	/* --- States -------------------------------- */
	const historyBottomRef = useRef<HTMLDivElement>(null);

	/* --- Functions ----------------------------- */
	const scrollToBottom = () : void => {
		historyBottomRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
	};

	/* --- Effects ------------------------------- */
	useEffect(() : void => {
		scrollToBottom();
	}, [ history.length ]);

	/* --- Component ----------------------------- */
	return (
		<div className={styles.historyContent}>
			{history.map((historyLine, index: number) => (
				<p key={`${historyLine}-${index}`}
				   className={clsx(styles.historyLine, ((index === 0) && styles.historyCurrentLine))}
				>
					{historyLine.output}
				</p>
			)).reverse()}

			<div ref={historyBottomRef} className={styles.historyBottom}/>
		</div>
	);
}

export default ConsoleHistory;