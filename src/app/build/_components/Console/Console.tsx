"use client";

import React, { useState } from "react";
import clsx from "clsx";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import ConsoleHistory from "./ConsoleHistory/ConsoleHistory";
import ConsoleCleanButton from "./ConsoleCleanButton/ConsoleCleanButton";
import { Fonts } from "@/constants";
import styles from "./Console.module.css";

function Console() : React.JSX.Element {
	/* --- States -------------------------------- */
	const logoBuilderCtx = useLogoBuilderContext();
	const [ commandLine, setCommandLine ] = useState<string>("");

	/* --- Functions ----------------------------- */
	const onCommandLineChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
		setCommandLine(event.target.value);
	};

	const onCommandLineKeyDown = (event: React.KeyboardEvent) : void => {
		switch (event.key) {
			case "Enter":
				logoBuilderCtx.executeCommand(commandLine);
				clearCommandLine();
				break;
			case "ArrowUp":
				const prevCommand = logoBuilderCtx.interpreter.history.prev();
				if (prevCommand) setCommandLine(prevCommand.command);
				break;
			case "ArrowDown":
				const nextCommand = logoBuilderCtx.interpreter.history.next();
				setCommandLine(nextCommand?.command ?? "");
				break;
		}
	};

	const clearCommandLine = () : void => { setCommandLine(""); };

	/* --- Component ----------------------------- */
	return (
		<div className={clsx(styles.console, Fonts.firaCode.className)}>
			<div className={styles.history}>
				<ConsoleHistory/>
			</div>

			<div className={styles.commandLine}>
				<input
					className={Fonts.firaCode.className}
					type="text"
					placeholder="Entrez une commande ici"
					value={commandLine}
					onChange={onCommandLineChange}
					onKeyDown={onCommandLineKeyDown}
				/>
			</div>
		</div>
	);
}
Console.CleanBtn = ConsoleCleanButton;

export default Console;