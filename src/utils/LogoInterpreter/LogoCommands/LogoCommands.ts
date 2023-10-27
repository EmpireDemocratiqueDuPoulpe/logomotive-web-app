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
			["AV", "AVANCE"],
			1,
			"Avance la tortue de X pixels. Exemple : AV 10"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.pointer.goForward(parseInt(args[0] as string));
	}
}

class BackwardCommand extends LogoCommand {
	public constructor() {
		super(
			["RE", "RECULE"],
			1,
			"Recule la tortue de X pixels. Exemple : RE 10"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.pointer.goBackward(parseInt(args[0] as string));
	}
}

class RotateRightCommand extends LogoCommand {
	public constructor() {
		super(
			["TD", "TOURNEDROITE"],
			1,
			"Tourne la tortue vers la droite de X degrés. Exemple : TD 90"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.pointer.rotateRight(parseInt(args[0] as string));
	}
}

class RotateLeftCommand extends LogoCommand {
	public constructor() {
		super(
			["TG", "TOURNEGAUCHE"],
			1,
			"Tourne la tortue vers la gauche de X degrés. Exemple : TG 90"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.pointer.rotateLeft(parseInt(args[0] as string));
	}
}

class DisableTrailCommand extends LogoCommand {
	public constructor() {
		super(
			["LC", "DESACTIVERTRACE"],
			0,
			"Désactive la trace derrière la tortue. Exemple : LC"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.pointer.enableTrail(false);
	}
}

class EnableTrailCommand extends LogoCommand {
	public constructor() {
		super(
			["BC", "ACTIVERTRACE"],
			0,
			"Active la trace derrière la tortue. Exemple : BC"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.pointer.enableTrail(true);
	}
}

class HideTurtleCommand extends LogoCommand {
	public constructor() {
		super(
			["CT", "CACHERTORTUE"],
			0,
			"Cache la tortue. Exemple : CT"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.pointer.setVisible(false);
	}
}

class ShowTurtleCommand extends LogoCommand {
	public constructor() {
		super(
			["MT", "MONTRERTORTUE"],
			0,
			"Montre la tortue. Exemple : MT"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.pointer.setVisible(true);
	}
}

class ResetAllCommand extends LogoCommand {
	public constructor() {
		super(
			["VE", "REINITIALISER"],
			0,
			"Réinitialise la toile et la position de la tortue. Exemple : VE"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.interpreter.reset(false);
	}
}

class ResetDrawCommand extends LogoCommand {
	public constructor() {
		super(
			["NT", "NETTOIE"],
			0,
			"Réinitialise la toile sans bouger la tortue. Exemple : NETTOIE"
		);
	}

	protected _execute(commandCtx: CommandContext, ...args: unknown[]): void {
		commandCtx.interpreter.reset(true);
	}
}

/*************************************************************
 * Export
 *************************************************************/
const commandsToExpose: LogoCommand[] = [
	new ForwardCommand(), new BackwardCommand(),
	new RotateRightCommand(), new RotateLeftCommand(),
	new DisableTrailCommand(), new EnableTrailCommand(),
	new HideTurtleCommand(), new ShowTurtleCommand(),
	new ResetAllCommand(), new ResetDrawCommand()
];

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