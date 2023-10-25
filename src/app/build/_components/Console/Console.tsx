"use client";

import React, { useState } from "react";
import clsx from "clsx";
import useLogoBuilderContext from "@/contexts/LogoBuilderCtx/LogoBuilderCtx";
import styles from "./Console.module.css";

function Console() : React.JSX.Element {
    /* --- States -------------------------------- */
    const logoBuilderCtx = useLogoBuilderContext();
    const [ commandLine, setCommandLine ] = useState<string>("");

    /* --- Functions ----------------------------- */
    const onCommandLineChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        setCommandLine(event.target.value);
    };

    const onCommandLineSend = (event: React.KeyboardEvent) : void => {
        if (event.key !== "Enter") return;

        logoBuilderCtx.executeCommand(commandLine);
        clearCommandLine();
    };

    const clearCommandLine = () : void => { setCommandLine(""); };

    /* --- Component ----------------------------- */
    return (
        <div className={styles.console}>
            <div className={styles.history}>
                <p className={styles.historyLine}>La tortue avance de <span className={styles.historyParam}>90</span>.</p>
                <p className={styles.historyLine}>La tortue tourne de <span className={styles.historyParam}>27deg</span>.</p>
                <p className={styles.historyLine}>La tortue mange la salade.</p>

                {logoBuilderCtx.interpreter.history.map((historyLine, index: number) => (
                    <p key={`${historyLine}-${index}`}
                       className={clsx(styles.historyLine, ((index === 0) && styles.historyCurrentLine))}
                    >
                        {historyLine}
                    </p>
                )).reverse()}
            </div>

            <div className={styles.inputBox}>
                <input
                    type="text"
                    placeholder="Entrez une commande ici"
                    value={commandLine}
                    onChange={onCommandLineChange}
                    onKeyDown={onCommandLineSend}
                />
            </div>
        </div>
    );
}

export default Console;