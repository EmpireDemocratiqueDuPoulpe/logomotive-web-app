"use client";

import type { CommandContext, ExportedCommands } from "./LogoCommands.types";

export abstract class LogoCommand {
	public readonly instructions: string[];
	public readonly expectedParameters: number;

	protected constructor(instructions: string[], expectedParameters: number) {
		this.instructions = instructions;
		this.expectedParameters = expectedParameters;
	}

	public execute(commandCtx: CommandContext, ...args: unknown[]) : void {
		if (args.length < this.expectedParameters) {
			throw new Error("Missing parameters"); // TODO
		}

		this._execute(commandCtx, ...args);
	}

	protected abstract _execute(commandCtx: CommandContext, ...args: unknown[]) : void
}

/*************************************************************
 * Commands
 *************************************************************/

class ForwardCommand extends LogoCommand {
	public constructor() { super([ "AV" ], 1); }

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.logoPointer.goForward(parseInt(args[0] as string));
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