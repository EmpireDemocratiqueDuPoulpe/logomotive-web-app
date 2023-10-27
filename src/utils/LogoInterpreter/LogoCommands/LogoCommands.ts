"use client";

import { InvalidArgumentsCount } from "@/exceptions";
import LogoInterpreter from "@/utils/LogoInterpreter/LogoInterpreter";
import type { ExposedCommands } from "./LogoCommands.types";
import {RGBToHex} from "@/utils/colors";

export abstract class LogoCommand {
	public readonly instructions: string[];
	public readonly expectedParameters: number;
	public readonly description: string | null;

	protected constructor(instructions: string[], expectedParameters: number, description?: string) {
		this.instructions = instructions;
		this.expectedParameters = expectedParameters;
		this.description = description ?? null;
	}

	public execute(interpreter: LogoInterpreter, ...args: string[]) : string | void {
		interpreter.debugger.printFnCall(`Command - execute[${this.instructions.join(" | ")}]`, "start");
		if (args.length !== this.expectedParameters) {
			throw new InvalidArgumentsCount(this.expectedParameters, args.length);
		}

		const commandOutput: string | void = this._execute(interpreter, ...args);
		interpreter.debugger.printFnCall(`Command - execute[${this.instructions.join(" | ")}]`, "end");
		return commandOutput;
	}

	protected abstract _execute(interpreter: LogoInterpreter, ...args: string[]) : string | void
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

	protected _execute(): string {
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

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		interpreter.pointer.goForward(parseInt(args[0]));
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

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		interpreter.pointer.goBackward(parseInt(args[0]));
	}
}

class SetTurtlePositionCommand extends LogoCommand {
	public constructor() {
		super(
			["FPOS"],
			2,
			"Définit la position de la tortue par rapport au centre de la toile. Exemple : FPOS -32 256"
		);
	}

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		interpreter.pointer.setPosition(parseInt(args[0]), parseInt(args[1]));
	}
}

class GetTurtlePositionCommand extends LogoCommand {
	public constructor() {
		super(
			["POS", "POSITION"],
			0,
			"Retourne la position de la tortue par rapport au centre de la toile. Exemple : POS"
		);
	}

	protected _execute(interpreter: LogoInterpreter): string {
		const pointerPosition = interpreter.pointer.getPosition();
		return `x: ${pointerPosition.x}, y: ${pointerPosition.y}`;
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

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		interpreter.pointer.rotateRight(parseInt(args[0]));
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

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		interpreter.pointer.rotateLeft(parseInt(args[0]));
	}
}

class SetTurtleAngleCommand extends LogoCommand {
	public constructor() {
		super(
			["FCAP"],
			1,
			"Définit l'angle de la tortue à X degrés par rapport à la verticale. Exemple : FCAP 180"
		);
	}

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		interpreter.pointer.setAngle(parseInt(args[0]));
	}
}

class GetTurtleAngleCommand extends LogoCommand {
	public constructor() {
		super(
			["CAP"],
			0,
			"Retourne l'angle de la tortue en degrés par rapport à la verticale. Exemple : CAP"
		);
	}

	protected _execute(interpreter: LogoInterpreter): string {
		return interpreter.pointer.getAngle().toString(10);
	}
}

class DisableTrailCommand extends LogoCommand {
	public constructor() {
		super(
			["LC", "LEVERCRAYON"],
			0,
			"Désactive la trace derrière la tortue. Exemple : LC"
		);
	}

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.pointer.enableTrail(false);
	}
}

class EnableTrailCommand extends LogoCommand {
	public constructor() {
		super(
			["BC", "BAISSERCRAYON"],
			0,
			"Active la trace derrière la tortue. Exemple : BC"
		);
	}

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.pointer.enableTrail(true);
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

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.pointer.setVisible(false);
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

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.pointer.setVisible(true);
	}
}

class ResetAllCommand extends LogoCommand {
	public constructor() {
		super(
			["VE", "REINITIALISER"],
			0,
			"Réinitialise la toile et les propriétés de la tortue (position, visible, ...). Exemple : VE"
		);
	}

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.reset(false);
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

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.reset(true);
	}
}

class ResetTurtleOriginCommand extends LogoCommand {
	public constructor() {
		super(
			["ORIGINE"],
			0,
			"Réinitialise uniquement la position de la tortue. Exemple : ORIGINE"
		);
	}

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.pointer.reset(true);
	}
}

class ClearHistoryCommand extends LogoCommand {
	public constructor() {
		super(
			["VT", "NETTOIECONSOLE"],
			0,
			"Vide la console. Exemple : VT"
		);
	}

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.history.clear();
	}
}

class ChangeTrailColorCommand extends LogoCommand {
	public constructor() {
		super(
			["FCC", "COULEURCRAYON"],
			3,
			"Change la couleur du crayon avec un code RGB. Exemple : FCC 255 0 0"
		);
	}

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		interpreter.pointer.setTrailColor(RGBToHex(args[0], args[1], args[2]));
	}
}

class ChangeBackgroundColorCommand extends LogoCommand {
	public constructor() {
		super(
			["FCB", "COULEURTOILE"],
			3,
			"Change la couleur de fond de la toile avec un code RGB. Exemple : FCB 128 255 96"
		);
	}

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		interpreter.setBackgroundColor(RGBToHex(args[0], args[1], args[2]));
	}
}

class RepeatCommand extends LogoCommand {
	public constructor() {
		super(
			["REPETER"],
			2,
			"Repète une série d'instructions x fois. Exemple : REPETER 8 [AV 80 TD 135]"
		);
	}

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		const commandsArr: string[] = interpreter.splitCommand(args[1].slice(1, (args[1].length - 1)));
		const commands: string[] = [];
		let idx: number = 0;

		while (idx < commandsArr.length) {
			const command: LogoCommand = interpreter.getCommand(commandsArr[idx]);
			const args: string[] = commandsArr.splice((idx + 1), command.expectedParameters);
			commands.push(`${command.instructions[0]} ${args}`);

			idx += command.expectedParameters;
		}

		const iterations: number = parseInt(args[0]);
		for (let currIter: number = 0; currIter < iterations; currIter++) {
			commands.map((fullCommand: string) : string | void => {
				interpreter.executeCommand(fullCommand);
			});
		}
	}
}

/*************************************************************
 * Export
 *************************************************************/
const commandsToExpose: LogoCommand[] = [
	new ForwardCommand(), new BackwardCommand(),
	new SetTurtlePositionCommand(), new GetTurtlePositionCommand(),
	new RotateRightCommand(), new RotateLeftCommand(),
	new SetTurtleAngleCommand(), new GetTurtleAngleCommand(),
	new DisableTrailCommand(), new EnableTrailCommand(),
	new HideTurtleCommand(), new ShowTurtleCommand(),
	new ResetAllCommand(), new ResetDrawCommand(), new ResetTurtleOriginCommand(),
	new ClearHistoryCommand(),
	new ChangeTrailColorCommand(), new ChangeBackgroundColorCommand(),
	new RepeatCommand()
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