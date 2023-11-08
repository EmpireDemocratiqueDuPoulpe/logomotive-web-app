import React, {useEffect, useRef, useState} from "react";
import clsx from "clsx";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import type { CommandHistory } from "@/utils/LogoInterpreter/LogoHistory/LogoHistory.types";
import styles from "./ConsoleHistory.module.css";

function ConsoleHistory() : React.JSX.Element {
	/* --- States -------------------------------- */
	const logoBuilderCtx = useLogoBuilderContext();
	const historyBottomRef = useRef<HTMLDivElement>(null);
	const [ history, setHistory ] = useState<CommandHistory[]>([]);

	/* --- Functions ----------------------------- */
	const scrollToBottom = () : void => {
		historyBottomRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
	};
	
	/* --- Effects ------------------------------- */
	useEffect(() => {
		const onHistoryUpdate = (history: CommandHistory[]) : void => {
			// The spread operator is used to prevent React from thinking it's the same array
			setHistory([ ...history ]);
		};

		logoBuilderCtx.interpreter.history.registerListener(onHistoryUpdate);
		return () : void => { logoBuilderCtx.interpreter.history.unregisterListener(onHistoryUpdate); };
	}, [ logoBuilderCtx.interpreter.history ]);

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