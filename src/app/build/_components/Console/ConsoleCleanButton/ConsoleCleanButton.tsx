import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom } from "@fortawesome/free-solid-svg-icons";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import type { CommandHistory } from "@/utils/LogoInterpreter/LogoHistory/LogoHistory.types";

function ConsoleCleanButton() : React.JSX.Element {
	/* --- States -------------------------------- */
	const logoBuilderCtx = useLogoBuilderContext();
	const [ history, setHistory ] = useState<CommandHistory[]>([]);

	/* --- Functions ----------------------------- */
	const clean = () : void => {
		logoBuilderCtx.interpreter.history.clear();
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

	/* --- Component ----------------------------- */
	return (
		<button onClick={clean} disabled={history.length === 0}>
			<FontAwesomeIcon icon={faBroom}/>
		</button>
	);
}

export default ConsoleCleanButton;