"use client";

export default class LogoDebugger {
	private enabled: boolean;

	constructor(enabled: boolean = false) { this.enabled = enabled; }

	/* --- Getters -------------------------------------------------------------------------------------------------- */
	public isEnabled() : boolean { return this.enabled; }

		/* --- Setters -------------------------------------------------------------------------------------------------- */
	public setEnabled(enabled: boolean = true) : void { this.enabled = enabled; }

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	public printFnCall(functionName: string, state: "start" | "end") : void {
		this.printDebug(`[${functionName}] - ${state.toUpperCase()}`);
	}

	private printDebug(message: string) : void {
		if (this.enabled) {
			console.debug(message);
		}
	}
}