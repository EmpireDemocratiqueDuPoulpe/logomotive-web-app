import type { ExportedCommands } from "./LogoCommands.types";

export abstract class LogoCommand {
	public readonly instructions: string[];
	public readonly expectedParameters: number;

	protected constructor(instructions: string[], expectedParameters: number) {
		this.instructions = instructions;
		this.expectedParameters = expectedParameters;
	}

	public execute(canvas: HTMLCanvasElement, ...args: unknown[]) : void {
		if (args.length < this.expectedParameters) {
			throw new Error("Missing parameters"); // TODO
		}

		this._execute(canvas, ...args);
	}

	protected abstract _execute(canvas: HTMLCanvasElement, ...args: unknown[]) : void
}

/*************************************************************
 * Commands
 *************************************************************/

class ForwardCommand extends LogoCommand {
	public constructor() { super([ "AV" ], 1); }

	protected _execute(canvas: HTMLCanvasElement, ...args: unknown[]): void {
		console.log("Forward!", canvas, args);
	}
}

/*************************************************************
 * Export
 *************************************************************/

const commandsToExport: LogoCommand[] = [ new ForwardCommand() ];

export default commandsToExport.reduce((commandsMap: ExportedCommands, command: LogoCommand) : ExportedCommands => {
	const currentMap: ExportedCommands = {};
	command.instructions.forEach((instruction: string) => (currentMap[instruction] = command));
	return { ...commandsMap, ...currentMap };
}, {});