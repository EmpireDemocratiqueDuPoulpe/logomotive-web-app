"use client";

import tinycolor from "tinycolor2";
import { InvalidInstruction, UnexpectedError } from "@/exceptions";
import LogoDebugger from "./LogoDebugger/LogoDebugger";
import LogoPointer from "./LogoPointer/LogoPointer";
import LogoHistory from "@/utils/LogoInterpreter/LogoHistory/LogoHistory";
import LogoInstructions from "@/utils/LogoInterpreter/LogoInstructions/LogoInstructions";
import type { LogoInstruction } from "@/utils/LogoInterpreter/LogoInstructions/LogoInstructions";
import type { Line, RenderReason, ScriptReturn } from "./LogoInterpreter.types";
import {ScopeFinder} from "@/utils/LogoInterpreter/LogoScopes/LogoScopes";
import {FoundScopes} from "@/utils/LogoInterpreter/LogoScopes/LogoScopes.types";

export default class LogoInterpreter {
	private drawCanvas: HTMLCanvasElement | null = null;
	private pointerCanvas: HTMLCanvasElement | null = null;
	private drawCanvasCtx: CanvasRenderingContext2D | null = null;
	private pointerCanvasCtx: CanvasRenderingContext2D | null = null;
	private canvasSize: { width: number, height: number } = { width: 0, height: 0 };
	private backgroundColor: string = "#FFFFFF";
	private isGridVisible: boolean = true;
	private gridSpacing: number = 10;

	public readonly debugger: LogoDebugger = new LogoDebugger(false);
	public readonly scopeFinder: ScopeFinder = new ScopeFinder();
	public readonly history: LogoHistory;
	public readonly pointer: LogoPointer;
	private readonly lines: Line[] = [];

	constructor() {
		this.history = new LogoHistory();
		this.pointer = new LogoPointer(this);
	}

	/* --- Getters -------------------------------------------------------------------------------------------------- */
	public getCanvasCenter() : { x: number, y: number } {
		return { x: (this.canvasSize.width / 2), y: (this.canvasSize.height / 2) };
	}

	/* --- Setters -------------------------------------------------------------------------------------------------- */
	public setDrawCanvas(canvas: HTMLCanvasElement | null) : void { this.setCanvases(canvas, this.pointerCanvas); }
	public setPointerCanvas(canvas: HTMLCanvasElement | null) : void { this.setCanvases(this.drawCanvas, canvas); }
	public setCanvases(drawCanvas: HTMLCanvasElement | null, pointerCanvas: HTMLCanvasElement | null) : void {
		this.debugger.printFnCall("Interpreter - setCanvases", "start");
		this.drawCanvas = drawCanvas;
		this.drawCanvasCtx = drawCanvas ? drawCanvas.getContext("2d", { alpha: false }) : null;

		this.pointerCanvas = pointerCanvas;
		this.pointerCanvasCtx = pointerCanvas ? pointerCanvas.getContext("2d", { alpha: true }) : null;

		this.setCanvasesSize();

		if (this.pointerCanvasCtx) {
			this.pointer.reset();
		}

		this.render("DOMUpdate");
		this.debugger.printFnCall("Interpreter - setCanvases", "end");
	}

	private setCanvasesSize() : void {
		const canvasRect: DOMRect | undefined = this.drawCanvas?.getBoundingClientRect();
		if (!canvasRect) return;

		this.canvasSize = { width: canvasRect.width, height: canvasRect.height };

		this.drawCanvas!.width = this.canvasSize.width;
		this.drawCanvas!.height = this.canvasSize.height;

		if (this.pointerCanvas) {
			this.pointerCanvas.width = this.canvasSize.width;
			this.pointerCanvas.height = this.canvasSize.height;
		}
	}

	public setBackgroundColor(hexColor: string) : void {
		this.debugger.printFnCall("Interpreter - setBackgroundColor", "start");
		this.backgroundColor = hexColor;
		this.debugger.printFnCall("Interpreter - setBackgroundColor", "end");
	}

	public setGridVisible(visible: boolean = true) : void {
		this.isGridVisible = visible;
	}

	public addLine(line: Line) : void { this.lines.push(line); }

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	public getInstruction(instruction: string) : LogoInstruction {
		if (!LogoInstructions.hasOwnProperty(instruction)) {
			throw new InvalidInstruction();
		}

		return LogoInstructions[instruction];
	}

	public splitInstruction(fullInstruction: string) : string[] {
		// Split by any whitespace character, unless within square brackets.
		return fullInstruction.split(/\s+(?![^\[]*])/);
	}

	public executeInstruction(fullInstruction: string) : Error | null {
		this.debugger.printFnCall("Interpreter - executeInstruction", "start");

		const [ instruction, ...args ] = this.splitInstruction(fullInstruction.trim());
		let output: string | void = "";
		let error: unknown | null = null;

		if (!instruction) return null;

		try {
			const instructionWorker: LogoInstruction = this.getInstruction(instruction);

			if (this.drawCanvasCtx && this.pointerCanvasCtx) {
				output = instructionWorker.execute(this, ...args);
				this.render("Instruction");
			} else {
				// noinspection ExceptionCaughtLocallyJS
				throw new UnexpectedError("Canvas not found!");
			}
		} catch (err: unknown) {
			error = err;
		} finally {
			output = `> ${fullInstruction}${output ? `\n${output}` : ""}`;

			if (error !== null && (error instanceof Error)) {
				output += "\n" + error.message;
			}

			this.history.push(fullInstruction, output);
		}

		this.debugger.printFnCall("Interpreter - executeInstruction", "end");
		return (error instanceof Error) ? error : null;
	}

	public executeCommand(fullCommand: string) : void {
		this.debugger.printFnCall("Interpreter - executeCommand", "start");
		this.executeInstruction(fullCommand);
		this.debugger.printFnCall("Interpreter - executeCommand", "end");
	}

	public executeScript(script: string) : ScriptReturn {
		this.debugger.printFnCall("Interpreter - executeScript", "start");
		this.reset();

		const foundScopes: FoundScopes = this.scopeFinder.find(script);
		// TODO
		return { status: "ok", errors: [] };

		const instructions: string[] = script.split("\n");
		const returnObj: ScriptReturn = { status: "ok", errors: [] };

		instructions.forEach((instruction: string, idx: number) : void => {
			const err: Error | null = this.executeInstruction(instruction);

			if (err) {
				returnObj.status = "failed";
				returnObj.errors.push({ line: (idx + 1), error: err.message });
				return;
			}
		});

		this.debugger.printFnCall("Interpreter - executeScript", "end");
		return returnObj;
	}

	public render(reason: RenderReason = null) : void {
		if (!this.drawCanvasCtx || !this.pointerCanvasCtx) return;
		this.debugger.printFnCall(`Interpreter - render[${reason ?? ""}]`, "start");

		this.drawCanvasCtx.fillStyle = this.backgroundColor;
		this.drawCanvasCtx.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
		this.pointerCanvasCtx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);

		this.drawGrid();
		this.drawLines();

		this.pointer.draw(this.pointerCanvasCtx);

		this.debugger.printFnCall(`Interpreter - render[${reason ?? ""}]`, "end");
	}

	private drawGrid() : void {
		if (!this.isGridVisible) return;
		if (this.drawCanvasCtx === null) return;

		// Get grid color
		let gridColor, gridCrossColor;
		const colorProfile: tinycolor.Instance = tinycolor(this.backgroundColor);

		if (colorProfile.isLight()) {
			gridColor = colorProfile.darken(10).toHexString();
			gridCrossColor = colorProfile.darken(12).toHexString();
		} else {
			gridColor = colorProfile.lighten(10).toHexString();
			gridCrossColor = colorProfile.lighten(12).toHexString();
		}

		// Draw grid
		this.drawCanvasCtx.beginPath();
		this.drawCanvasCtx.strokeStyle = gridColor;
		this.drawCanvasCtx.lineWidth = 1;

		for (let x: number = 0; x <= this.canvasSize.width; x += this.gridSpacing) {
			this.drawCanvasCtx.moveTo((0.5 + x), 0);
			this.drawCanvasCtx.lineTo((0.5 + x), this.canvasSize.height);
		}

		for (let y: number = 0; y <= this.canvasSize.height; y += this.gridSpacing) {
			this.drawCanvasCtx.moveTo(0, (0.5 + y));
			this.drawCanvasCtx.lineTo(this.canvasSize.width, (0.5 + y));
		}

		this.drawCanvasCtx.stroke();
		this.drawCanvasCtx.closePath();

		// Draw center
		this.drawCanvasCtx.beginPath();
		this.drawCanvasCtx.strokeStyle = gridCrossColor;
		this.drawCanvasCtx.lineWidth = 2;

		this.drawCanvasCtx.moveTo(0, (this.canvasSize.height / 2));
		this.drawCanvasCtx.lineTo(this.canvasSize.width, (this.canvasSize.height / 2));

		this.drawCanvasCtx.moveTo((this.canvasSize.width / 2), 0);
		this.drawCanvasCtx.lineTo((this.canvasSize.width / 2), this.canvasSize.height);

		this.drawCanvasCtx.stroke();
		this.drawCanvasCtx.closePath();
	}

	private drawLines() : void {
		if (this.drawCanvasCtx === null) return;

		this.drawCanvasCtx.lineWidth = 1;

		for (const line of this.lines) {
			this.drawCanvasCtx.beginPath();
			this.drawCanvasCtx.strokeStyle = line.hexColor;

			this.drawCanvasCtx.moveTo(line.from.x, line.from.y);
			this.drawCanvasCtx.lineTo(line.to.x, line.to.y);

			this.drawCanvasCtx.stroke();
			this.drawCanvasCtx.closePath();
		}
	}

	public reset(keepTurtle: boolean = false) : void {
		this.lines.length = 0;

		if (!keepTurtle) {
			this.pointer.reset();
		}
	}
}