"use client";

import LogoInterpreter from "@/utils/LogoInterpreter/LogoInterpreter";

export default class LogoPointer {
	private readonly logoInterpreter: LogoInterpreter;
	private x: number = 0;
	private y: number = 0;
	private size: number = 32;
	private rotation: number = 0;
	private visible: boolean = true;
	private trail: boolean = true;
	private image: HTMLImageElement = new Image();

	constructor(logoInterpreter: LogoInterpreter) {
		this.logoInterpreter = logoInterpreter;

		this.image.onload = () : void => { logoInterpreter.draw(); };
		this.image.src = "/images/logoPointer.jpg";
	}

	/* --- Setters -------------------------------------------------------------------------------------------------- */
	public enableTrail(enable: boolean = true) : void { this.trail = enable; }
	public setVisible(visible: boolean = true) : void { this.visible = visible; }

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	public goForward(distance: number) : void {
		this.x = Math.round(Math.cos(this.rotation * Math.PI / 180) * distance + this.x);
		this.y = Math.round(Math.sin(this.rotation * Math.PI / 180) * distance + this.y);
		this.logoInterpreter.draw();
	}

	public goBackward(distance: number) : void {
		throw new Error("Not implemented"); // TODO
	}

	public rotateRight(angle: number) : void {
		this.rotation = (this.rotation + angle) % 360;
		this.logoInterpreter.draw();
	}

	public rotateLeft(angle: number) : void {
		this.rotation = 360 + ((this.rotation - angle) % 360);
		this.logoInterpreter.draw();
	}

	public moveTo(x: number, y: number) : void {
		this.x = x;
		this.y = y;
		this.logoInterpreter.draw();
	}

	public draw(canvasCtx: CanvasRenderingContext2D) : void {
		if (this.image.complete && this.visible) {
			canvasCtx.drawImage(this.image, this.x, this.y, this.size, this.size);
		}
	}
}