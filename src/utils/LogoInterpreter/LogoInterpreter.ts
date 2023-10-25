"use client";

import LogoDebugger from "./LogoDebugger/LogoDebugger";
import LogoPointer from "./LogoPointer/LogoPointer";
import LogoHistory from "@/utils/LogoInterpreter/LogoHistory/LogoHistory";
import LogoCommands from "./LogoCommands/LogoCommands";
import type { LogoCommand } from "./LogoCommands/LogoCommands";
import type { RenderReason } from "./LogoInterpreter.types";

export default class LogoInterpreter {
	private drawCanvas: HTMLCanvasElement | null = null;
	private pointerCanvas: HTMLCanvasElement | null = null;
	private drawCanvasCtx: CanvasRenderingContext2D | null = null;
	private pointerCanvasCtx: CanvasRenderingContext2D | null = null;
	private canvasSize: { width: number, height: number } = { width: 0, height: 0 };

	public readonly debugger: LogoDebugger = new LogoDebugger(true);
	public readonly history: LogoHistory;
	private readonly pointer: LogoPointer;

	constructor() {
		this.history = new LogoHistory();
		this.pointer = new LogoPointer(this);
	}

	/* --- Setters -------------------------------------------------------------------------------------------------- */
	public setDrawCanvas(canvas: HTMLCanvasElement | null) : void { this.setCanvases(canvas, this.pointerCanvas); }
	public setPointerCanvas(canvas: HTMLCanvasElement | null) : void { this.setCanvases(this.drawCanvas, canvas); }
	public setCanvases(drawCanvas: HTMLCanvasElement | null, pointerCanvas: HTMLCanvasElement | null) : void {
		this.debugger.printFnCall("Interpreter - setCanvases", "start");
		this.drawCanvas = drawCanvas;
		this.drawCanvasCtx = drawCanvas ? drawCanvas.getContext("2d", { alpha: false }) : null;

		this.pointerCanvas = pointerCanvas;
		this.pointerCanvasCtx = pointerCanvas ? pointerCanvas.getContext("2d", { alpha: false }) : null;

		this.setCanvasesSize();
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

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	private getCommand(command: string) : LogoCommand {
		if (!LogoCommands.hasOwnProperty(command)) {
			throw new Error("Invalid command!"); // TODO
		}

		return LogoCommands[command];
	}

	public executeCommand(fullCommand: string) : void {
		this.debugger.printFnCall("Interpreter - executeCommand", "start");

		const [ command, ...args ] = fullCommand.split(" ");
		const commandWorker: LogoCommand = this.getCommand(command);
		this.history.push(fullCommand);

		if (this.drawCanvasCtx && this.pointerCanvasCtx) {
			commandWorker.execute({
				drawCtx: this.drawCanvasCtx,
				pointerCtx: this.pointerCanvasCtx,
				pointer: this.pointer,
				debugger: this.debugger
			}, ...args);
			this.render("Command");
		} else {
			this.debugger.printFnCall("Interpreter - executeCommand", "end");
			throw new Error("Unknown error: Canvas not found!"); // TODO
		}

		this.debugger.printFnCall("Interpreter - executeCommand", "end");
	}

	public render(reason: RenderReason = null) : void {
		if (!this.drawCanvasCtx || !this.pointerCanvasCtx) return;
		this.debugger.printFnCall(`Interpreter - render[${reason ?? ""}]`, "start");

		this.drawCanvasCtx.fillStyle = this.pointerCanvasCtx.fillStyle = "#FFFFFF";
		this.drawCanvasCtx.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);
		this.pointerCanvasCtx.fillRect(0, 0, this.canvasSize.width, this.canvasSize.height);

		this.pointer.draw(this.pointerCanvasCtx);

		this.debugger.printFnCall(`Interpreter - render[${reason ?? ""}]`, "end");
	}
}