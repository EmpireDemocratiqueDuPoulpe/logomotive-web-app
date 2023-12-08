"use client";

import { InvalidArgumentsCount } from "@/exceptions";
import LogoInterpreter from "@/utils/LogoInterpreter/LogoInterpreter";
import type { ExposedInstructions } from "./LogoInstructions.types";
import {RGBToHex} from "@/utils/colors";

export abstract class LogoInstruction {
	public readonly instructions: string[];
	public readonly expectedParameters: number;
	public readonly description: string | null;

	protected constructor(instructions: string[], expectedParameters: number, description?: string) {
		this.instructions = instructions;
		this.expectedParameters = expectedParameters;
		this.description = description ?? null;
	}

	public execute(interpreter: LogoInterpreter, ...args: string[]) : string | void {
		interpreter.debugger.printFnCall(`Instruction - execute[${this.instructions.join(" | ")}]`, "start");
		if (args.length !== this.expectedParameters) {
			throw new InvalidArgumentsCount(this.expectedParameters, args.length);
		}

		const instructionOutput: string | void = this._execute(interpreter, ...args);
		interpreter.debugger.printFnCall(`Instruction - execute[${this.instructions.join(" | ")}]`, "end");
		return instructionOutput;
	}

	protected abstract _execute(interpreter: LogoInterpreter, ...args: string[]) : string | void
}

/*************************************************************
 * Help instruction - This one is special
 *************************************************************/
class HelpInstruction extends LogoInstruction {
	private message: string = "";

	public constructor(instructions: LogoInstruction[]) {
		super([ "HELP" ], 0);
		this.buildMessage(instructions);
	}

	private buildMessage(instructions: LogoInstruction[]) : void {
		const messageLines: string[] = [];

		instructions.forEach((instruction: LogoInstruction) : void => {
			if (instruction.description) {
				messageLines.push(`${instruction.instructions.join(", ")} - ${instruction.description}`);
			}
		});

		this.message = messageLines.join("\n");
	}

	protected _execute(): string {
		return this.message;
	}
}

/*************************************************************
 * Instructions
 *************************************************************/
class ForwardInstruction extends LogoInstruction {
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

class BackwardInstruction extends LogoInstruction {
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

class SetTurtlePositionInstruction extends LogoInstruction {
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

class GetTurtlePositionInstruction extends LogoInstruction {
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


class RotateRightInstruction extends LogoInstruction {
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

class RotateLeftInstruction extends LogoInstruction {
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

class SetTurtleAngleInstruction extends LogoInstruction {
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

class GetTurtleAngleInstruction extends LogoInstruction {
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

class DisableTrailInstruction extends LogoInstruction {
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

class EnableTrailInstruction extends LogoInstruction {
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

class HideTurtleInstruction extends LogoInstruction {
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

class ShowGridInstruction extends LogoInstruction {
	public constructor() {
		super(
			["MG", "MONTRERGRILLE"],
			0,
			"Montre la grille. Exemple : MG"
		);
	}

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.setGridVisible(true);
	}
}

class HideGridInstruction extends LogoInstruction {
	public constructor() {
		super(
			["CG", "CACHERGRILLE"],
			0,
			"Cache la grille. Exemple : CG"
		);
	}

	protected _execute(interpreter: LogoInterpreter): void {
		interpreter.setGridVisible(false);
	}
}

class ShowTurtleInstruction extends LogoInstruction {
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

class ResetAllInstruction extends LogoInstruction {
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

class ResetDrawInstruction extends LogoInstruction {
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

class ResetTurtleOriginInstruction extends LogoInstruction {
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

class ClearHistoryInstruction extends LogoInstruction {
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

class ChangeTrailColorInstruction extends LogoInstruction {
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

class ChangeBackgroundColorInstruction extends LogoInstruction {
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

class RepeatInstruction extends LogoInstruction {
	public constructor() {
		super(
			["REPETER"],
			2,
			"Repète une série d'instructions x fois. Exemple : REPETER 8 [AV 80 TD 135]"
		);
	}

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): void {
		const instructionsArr: string[] = interpreter.splitInstruction(args[1].slice(1, (args[1].length - 1)));
		const instructions: string[] = [];
		let idx: number = 0;

		while (idx < instructionsArr.length) {
			const instruction: LogoInstruction = interpreter.getInstruction(instructionsArr[idx]);
			const args: string[] = instructionsArr.splice((idx + 1), instruction.expectedParameters);
			instructions.push(`${instruction.instructions[0]} ${args}`);

			idx += instruction.expectedParameters;
		}

		const iterations: number = parseInt(args[0]);
		for (let currIter: number = 0; currIter < iterations; currIter++) {
			instructions.map((fullInstruction: string) : string | void => {
				interpreter.executeInstruction(fullInstruction);
			});
		}
	}
}

/*************************************************************
 * Export
 *************************************************************/
const instructionsToExpose: LogoInstruction[] = [
	new ForwardInstruction(), new BackwardInstruction(),
	new SetTurtlePositionInstruction(), new GetTurtlePositionInstruction(),
	new RotateRightInstruction(), new RotateLeftInstruction(),
	new SetTurtleAngleInstruction(), new GetTurtleAngleInstruction(),
	new DisableTrailInstruction(), new EnableTrailInstruction(),
	new HideTurtleInstruction(), new ShowTurtleInstruction(),
	new HideGridInstruction(), new ShowGridInstruction(),
	new ResetAllInstruction(), new ResetDrawInstruction(), new ResetTurtleOriginInstruction(),
	new ClearHistoryInstruction(),
	new ChangeTrailColorInstruction(), new ChangeBackgroundColorInstruction(),
	new RepeatInstruction()
];

function prepareInstructions() : ExposedInstructions {
	const instructions: ExposedInstructions = instructionsToExpose.reduce((instructionsMap: ExposedInstructions, instruction: LogoInstruction) : ExposedInstructions => {
		const currentMap: ExposedInstructions = {};
		instruction.instructions.forEach((ins: string) => (currentMap[ins] = instruction));
		return { ...instructionsMap, ...currentMap };
	}, {});

	const helpInstruction: HelpInstruction = new HelpInstruction(instructionsToExpose);
	helpInstruction.instructions.forEach((instruction: string) => (instructions[instruction] = helpInstruction));

	return instructions;
}

export default prepareInstructions();