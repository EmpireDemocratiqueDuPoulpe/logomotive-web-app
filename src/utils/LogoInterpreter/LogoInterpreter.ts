import LogoCommands from "./LogoCommands";
import type { LogoCommand } from "./LogoCommands";

export default class LogoInterpreter {
	private canvas: HTMLCanvasElement | null = null;

	constructor() {}

	/* --- Setters -------------------------------------------------------------------------------------------------- */
	public setCanvas(canvas: HTMLCanvasElement | null) : void { this.canvas = canvas; }

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	private getCommand(command: string) : LogoCommand {
		if (!LogoCommands.hasOwnProperty(command)) {
			throw new Error("Invalid command!"); // TODO
		}

		return LogoCommands[command];
	}

	public executeCommand(command: string, ...args: unknown[]) : void {
		const commandWorker: LogoCommand = this.getCommand(command);

		if (this.canvas) {
			commandWorker.execute(this.canvas, ...args);
		}
	}
}