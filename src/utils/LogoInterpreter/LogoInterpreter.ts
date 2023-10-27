"use client";

import { InvalidCommand, UnexpectedError } from "@/exceptions";
import LogoDebugger from "./LogoDebugger/LogoDebugger";
import LogoPointer from "./LogoPointer/LogoPointer";
import LogoHistory from "@/utils/LogoInterpreter/LogoHistory/LogoHistory";
import LogoCommands from "./LogoCommands/LogoCommands";
import type { LogoCommand } from "./LogoCommands/LogoCommands";
import type { Line, RenderReason } from "./LogoInterpreter.types";

export default class LogoInterpreter {
	private drawCanvas: HTMLCanvasElement | null = null;
	private pointerCanvas: HTMLCanvasElement | null = null;
	private drawCanvasCtx: CanvasRenderingContext2D | null = null;
	private pointerCanvasCtx: CanvasRenderingContext2D | null = null;
	private canvasSize: { width: number, height: number } = { width: 0, height: 0 };

	public readonly debugger: LogoDebugger = new LogoDebugger(true);
	public readonly history: LogoHistory;
	private readonly pointer: LogoPointer;
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

	public addLine(line: Line) : void { this.lines.push(line); }

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	private getCommand(command: string) : LogoCommand {
		if (!LogoCommands.hasOwnProperty(command)) {
			throw new InvalidCommand();
		}

		return LogoCommands[command];
	}

	public executeCommand(fullCommand: string) : void {
		this.debugger.printFnCall("Interpreter - executeCommand", "start");

		const [ command, ...args ] = fullCommand.split(" ");
		let output: string | void = "";
		let error: unknown | null = null;

		try {
			const commandWorker: LogoCommand = this.getCommand(command);

			if (this.drawCanvasCtx && this.pointerCanvasCtx) {
				output = commandWorker.execute({
					interpreter: this,
					pointer: this.pointer,
					debugger: this.debugger
				}, ...args);
				this.render("Command");
			} else {
				// noinspection ExceptionCaughtLocallyJS
				throw new UnexpectedError("Canvas not found!");
			}
		} catch (err: unknown) {
			error = err;
		} finally {
			output = `> ${fullCommand}${output ? `\n${output}` : ""}`;

			if (error !== null && (error instanceof Error)) {
				output += "\n" + error.message;
			}

			this.history.push(fullCommand, output);
		}

		this.debugger.printFnCall("Interpreter - executeCommand", "end");
	}

	public render(reason: RenderReason = null) : void {
		if (!this.drawCanvasCtx || !this.pointerCanvasCtx) return;
		this.debugger.printFnCall(`Interpreter - render[${reason ?? ""}]`, "start");

		this.drawCanvasCtx.fillStyle = this.pointerCanvasCtx.fillStyle = "#FFFFFF";
		this.drawCanvasCtx.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
		this.pointerCanvasCtx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);

		this.drawDebug();
		this.drawLines();

		this.pointer.draw(this.pointerCanvasCtx);

		this.debugger.printFnCall(`Interpreter - render[${reason ?? ""}]`, "end");
	}

	private drawDebug() : void {
		if (!this.debugger.isEnabled() || (this.drawCanvasCtx === null)) return;

		this.drawCanvasCtx.beginPath();
		this.drawCanvasCtx.strokeStyle = "#FF0000";
		this.drawCanvasCtx.lineWidth = 1;

		this.drawCanvasCtx.moveTo(0, (this.canvasSize.height / 2));
		this.drawCanvasCtx.lineTo(this.canvasSize.width, (this.canvasSize.height / 2));

		this.drawCanvasCtx.moveTo((this.canvasSize.width / 2), 0);
		this.drawCanvasCtx.lineTo((this.canvasSize.width / 2), this.canvasSize.height);

		this.drawCanvasCtx.stroke();
		this.drawCanvasCtx.closePath();
	}

	private drawLines() : void {
		if (this.drawCanvasCtx === null) return;

		this.drawCanvasCtx.beginPath();
		this.drawCanvasCtx.strokeStyle = "#00FF00";
		this.drawCanvasCtx.lineWidth = 1;

		for (const line of this.lines) {
			this.drawCanvasCtx.moveTo(line.from.x, line.from.y);
			this.drawCanvasCtx.lineTo(line.to.x, line.to.y);
		}

		this.drawCanvasCtx.stroke();
		this.drawCanvasCtx.closePath();
	}

	public reset(keepTurtle: boolean = false) : void {
		this.lines.length = 0;

		if (!keepTurtle) {
			this.pointer.reset();
		}
	}
}