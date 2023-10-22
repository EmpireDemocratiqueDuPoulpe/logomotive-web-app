"use client";

import LogoCommands from "./LogoCommands/LogoCommands";
import LogoPointer from "./LogoPointer/LogoPointer";
import type { LogoCommand } from "./LogoCommands/LogoCommands";

export default class LogoInterpreter {
	private drawCanvas: HTMLCanvasElement | null = null;
	private pointerCanvas: HTMLCanvasElement | null = null;
	private drawCanvasCtx: CanvasRenderingContext2D | null = null;
	private pointerCanvasCtx: CanvasRenderingContext2D | null = null;
	private canvasSize: { width: number, height: number } = { width: 0, height: 0 };

	private readonly logoPointer: LogoPointer;

	constructor() {
		this.logoPointer = new LogoPointer(this);
	}

	/* --- Setters -------------------------------------------------------------------------------------------------- */
	public setDrawCanvas(canvas: HTMLCanvasElement | null) : void { this.setCanvases(canvas, this.pointerCanvas); }
	public setPointerCanvas(canvas: HTMLCanvasElement | null) : void { this.setCanvases(this.drawCanvas, canvas); }
	public setCanvases(drawCanvas: HTMLCanvasElement | null, pointerCanvas: HTMLCanvasElement | null) : void {
		this.drawCanvas = drawCanvas;
		this.drawCanvasCtx = drawCanvas ? drawCanvas.getContext("2d") : null;

		this.pointerCanvas = pointerCanvas;
		this.pointerCanvasCtx = pointerCanvas ? pointerCanvas.getContext("2d") : null;

		this.setCanvasesSize();
		this.draw();
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

	public executeCommand(command: string, ...args: unknown[]) : void {
		const commandWorker: LogoCommand = this.getCommand(command);

		if (this.drawCanvasCtx && this.pointerCanvasCtx) {
			commandWorker.execute({
				drawCtx: this.drawCanvasCtx,
				pointerCtx: this.pointerCanvasCtx,
				logoPointer: this.logoPointer
			}, ...args);
			this.draw();
		} else {
			throw new Error("Unknown error: Canvas not found!"); // TODO
		}
	}

	public draw() : void {
		if (this.drawCanvasCtx && this.pointerCanvasCtx) {
			this.drawCanvasCtx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
			this.pointerCanvasCtx.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);

			this.logoPointer.draw(this.pointerCanvasCtx);
		}
	}
}