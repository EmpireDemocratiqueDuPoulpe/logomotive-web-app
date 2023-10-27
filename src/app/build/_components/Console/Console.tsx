"use client";

import React, {useState, useEffect} from "react";
import clsx from "clsx";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import ConsoleHistory from "./ConsoleHistory/ConsoleHistory";
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
                const prevCommand: string | null = logoBuilderCtx.interpreter.history.prev();
                if (prevCommand) setCommandLine(prevCommand);
                break;
            case "ArrowDown":
                const nextCommand: string | null = logoBuilderCtx.interpreter.history.next();
                setCommandLine(nextCommand ?? "");
                break;
        }
    };

    const clearCommandLine = () : void => { setCommandLine(""); };

    /* --- Component ----------------------------- */
    return (
        <div className={styles.console}>
            <div className={styles.history}>
                <ConsoleHistory history={logoBuilderCtx.interpreter.history}/>
            </div>

            <div className={styles.commandLine}>
                <input
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

export default Console;