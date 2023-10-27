"use client";

import { MissingArguments } from "@/exceptions";
import type { CommandContext, ExposedCommands } from "./LogoCommands.types";

export abstract class LogoCommand {
	public readonly instructions: string[];
	public readonly expectedParameters: number;
	public readonly description: string | null;

	protected constructor(instructions: string[], expectedParameters: number, description?: string) {
		this.instructions = instructions;
		this.expectedParameters = expectedParameters;
		this.description = description ?? null;
	}

	public execute(commandCtx: CommandContext, ...args: unknown[]) : string | void {
		commandCtx.debugger.printFnCall(`Command - execute[${this.instructions.join(" | ")}]`, "start");
		if (args.length < this.expectedParameters) {
			throw new MissingArguments(this.expectedParameters, args.length);
		}

		const commandOutput: string | void = this._execute(commandCtx, ...args);
		commandCtx.debugger.printFnCall(`Command - execute[${this.instructions.join(" | ")}]`, "end");
		return commandOutput;
	}

	protected abstract _execute(commandCtx: CommandContext, ...args: unknown[]) : string | void
}

/*************************************************************
 * Help command - This one is special
 *************************************************************/
class HelpCommand extends LogoCommand {
	private message: string = "";

	public constructor(commands: LogoCommand[]) {
		super([ "HELP" ], 0);
		this.buildMessage(commands);
	}

	private buildMessage(commands: LogoCommand[]) : void {
		const messageLines: string[] = [];

		commands.forEach((command: LogoCommand) : void => {
			if (command.description) {
				messageLines.push(`${command.instructions.join(", ")} - ${command.description}`);
			}
		});

		this.message = messageLines.join("\n");
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): string {
		return this.message;
	}
}

/*************************************************************
 * Commands
 *************************************************************/
class ForwardCommand extends LogoCommand {
	public constructor() {
		super(
			["AV"],
			1,
			"Avance la tortue de X pixels. Exemple: AV 10"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.pointer.goForward(parseInt(args[0] as string));
	}
}

/*************************************************************
 * Export
 *************************************************************/
const commandsToExpose: LogoCommand[] = [ new ForwardCommand() ];

function prepareCommands() : ExposedCommands {
	const commands: ExposedCommands = commandsToExpose.reduce((commandsMap: ExposedCommands, command: LogoCommand) : ExposedCommands => {
		const currentMap: ExposedCommands = {};
		command.instructions.forEach((instruction: string) => (currentMap[instruction] = command));
		return { ...commandsMap, ...currentMap };
	}, {});

	const helpCommand: HelpCommand = new HelpCommand(commandsToExpose);
	helpCommand.instructions.forEach((instruction: string) => (commands[instruction] = helpCommand));

	return commands;
}

export default prepareCommands();