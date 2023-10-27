"use client";

import LogoInterpreter from "@/utils/LogoInterpreter/LogoInterpreter";
import { NotImplemented } from "@/exceptions";

export default class LogoPointer {
	private readonly interpreter: LogoInterpreter;
	private x: number = 500;
	private y: number = 300;
	private size: number = 32;
	private rotation: number = 0;
	private visible: boolean = true;
	private trail: boolean = true;
	private readonly image: HTMLImageElement | null;

	constructor(interpreter: LogoInterpreter) {
		this.interpreter = interpreter;

		// Prevent Next.js and SSR from trying to build on image element on the server side.
		if (typeof window === "undefined" || typeof document === "undefined") {
			this.image = null;
		} else {
			this.image = new Image();
			this.image.onload = () : void => {
				this.image!.width = this.size;
				this.image!.height = this.size;
				this.interpreter.render("AssetLoaded");
			};
			// noinspection SpellCheckingInspection
			this.image.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjxzdmcgZmlsbD0iIzAwMDAwMCIgaGVpZ2h0PSI4MDBweCIgd2lkdGg9IjgwMHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDMzOC4xOTkgMzM4LjE5OSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8ZyBpZD0iWE1MSURfMzExXyI+DQoJPGc+DQoJCTxnPg0KCQkJPHBhdGggZD0iTTEyNy4wODgsMTQxLjgwOWwtMzYuMzQ1LTUwLjAzYy0xMC4xNDgsOC43NTktMTguODMxLDE5LjE2OS0yNS41ODYsMzAuODQ1SDYwYy0zMy4xMzgsMC02MCwyNi44NjMtNjAsNjBoNDkuMQ0KCQkJCWMwLDkuNDQ2LDEuMDk4LDE4LjYzNCwzLjE2MSwyNy40NTFsNTguODY0LTE5LjEyN0wxMjcuMDg4LDE0MS44MDl6Ii8+DQoJCQk8cGF0aCBkPSJNMTk0LjkxNiwxMzAuMDYydi0wLjAwMWwzNi4zNTQtNTAuMDU1Yy02Ljk2My00LjIyNy0xNC4zNzQtNy43ODgtMjIuMTctMTAuNTQ0VjQyLjYyNGMwLTIyLjA5MS0xNy45MDgtNDAtNDAtNDANCgkJCQljLTIyLjA5MiwwLTQwLDE3LjkwOS00MCw0MHYyNi44MzhjLTcuNzk3LDIuNzU2LTE1LjIwOSw2LjMxOC0yMi4xNzIsMTAuNTQ1bDM2LjM1NCw1MC4wNTRIMTk0LjkxNnoiLz4NCgkJCTxwYXRoIGQ9Ik01OC40NCwyMjkuMTA5YzQuNTU1LDEwLjgzMSwxMC42NDksMjAuODU0LDE4LjAxNywyOS43OTJjLTE0LjM0OSwyNS4zODItOC40MDIsNTguMTI1LDE1LjIzOCw3Ni42NzNsMzIuNjI5LTQxLjU4OQ0KCQkJCWMxMC44OTEsNC4zODMsMjIuNTcxLDcuMjEsMzQuNzY5LDguMjE5bDAuMDA0LTYxLjgyN2wtNDEuODIzLTMwLjM5Mkw1OC40NCwyMjkuMTA5eiIvPg0KCQkJPHBhdGggZD0iTTI3OC4xOTksMTIyLjYyNGgtNS4xNTdjLTYuNzU1LTExLjY3Ni0xNS40MzktMjIuMDg2LTI1LjU4Ny0zMC44NDZsLTM2LjM0NCw1MC4wMjlsMTUuOTYzLDQ5LjE0bDU4Ljg2NCwxOS4xMjYNCgkJCQljMi4wNjMtOC44MTYsMy4xNjEtMTguMDA0LDMuMTYxLTI3LjQ0OWg0OS4xQzMzOC4xOTksMTQ5LjQ4NywzMTEuMzM3LDEyMi42MjQsMjc4LjE5OSwxMjIuNjI0eiIvPg0KCQkJPHBhdGggZD0iTTIyMC45MjYsMjA5Ljk4NGwtNDEuODIyLDMwLjM5MWwwLjAwNSw2MS44MjhjMTIuMTk2LTEuMDA5LDIzLjg3Ny0zLjgzNiwzNC43NjctOC4yMTlsMzIuNjI5LDQxLjU4OQ0KCQkJCWMyMy42NDEtMTguNTQ4LDI5LjU4OC01MS4yOSwxNS4yMzgtNzYuNjczYzcuMzY3LTguOTM3LDEzLjQ2Mi0xOC45NjEsMTguMDE3LTI5Ljc5MUwyMjAuOTI2LDIwOS45ODR6Ii8+DQoJCQk8cG9seWdvbiBwb2ludHM9IjE5Mi43NjQsMTUwLjA2IDE0NS40MzYsMTUwLjA2IDEzMC44MDcsMTk1LjA5NiAxNjkuMSwyMjIuOTIyIDIwNy4zOTMsMTk1LjA5NiAJCQkiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg==";
		}
	}

	/* --- Setters -------------------------------------------------------------------------------------------------- */
	public enableTrail(enable: boolean = true) : void {
		this.interpreter.debugger.printFnCall("Pointer - enableTrail", "start");
		this.trail = enable;
		this.interpreter.debugger.printFnCall("Pointer - enableTrail", "end");
	}
	public setVisible(visible: boolean = true) : void {
		this.interpreter.debugger.printFnCall("Pointer - setVisible", "start");
		this.visible = visible;
		this.interpreter.debugger.printFnCall("Pointer - setVisible", "end");
	}

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	public goForward(distance: number) : void {
		this.interpreter.debugger.printFnCall("Pointer - goForward", "start");
		this.x = Math.round(Math.cos((270 + this.rotation) * Math.PI / 180) * distance + this.x);
		this.y = Math.round(Math.sin((270 + this.rotation) * Math.PI / 180) * distance + this.y);
		this.interpreter.debugger.printFnCall("Pointer - goForward", "end");
	}

	public goBackward(distance: number) : void {
		this.interpreter.debugger.printFnCall("Pointer - goBackward", "start");
		throw new NotImplemented();
		this.interpreter.debugger.printFnCall("Pointer - goBackward", "end");
	}

	public rotateRight(angle: number) : void {
		this.interpreter.debugger.printFnCall("Pointer - rotateRight", "start");
		this.rotation = (this.rotation + angle) % 360;
		this.interpreter.debugger.printFnCall("Pointer - rotateRight", "end");
	}

	public rotateLeft(angle: number) : void {
		this.interpreter.debugger.printFnCall("Pointer - rotateLeft", "start");
		this.rotation = 360 + ((this.rotation - angle) % 360);
		this.interpreter.debugger.printFnCall("Pointer - rotateLeft", "end");
	}

	public moveTo(x: number, y: number) : void {
		this.interpreter.debugger.printFnCall("Pointer - moveTo", "start");
		this.x = x;
		this.y = y;
		this.interpreter.debugger.printFnCall("Pointer - moveTo", "end");
	}

	public draw(canvasCtx: CanvasRenderingContext2D) : void {
		this.interpreter.debugger.printFnCall("Pointer - draw", "start");
		if (this.image && this.image.complete && this.visible) {
			// Save the current canvas context.
			canvasCtx.save();

			// Move to the desired position and angle.
			// See: https://stackoverflow.com/a/46921702
			canvasCtx.translate(this.x, this.y);
			canvasCtx.rotate(this.rotation * Math.PI / 180);
			canvasCtx.translate(-(this.size / 2), -(this.size / 2));

			// Draw the image
			canvasCtx.drawImage(this.image, 0, 0, this.size, this.size);  // TODO: optimize: cache image with reduced size

			// Restore the context
			canvasCtx.restore();
		}
		this.interpreter.debugger.printFnCall("Pointer - draw", "end");
	}
}