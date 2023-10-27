import type { CommandHistory } from "./LogoHistory.types";

export default class LogoHistory {
	private entries: CommandHistory[];
	private cursor: number = -1;
	private static readonly MAX_LENGTH: number = 1000;

	constructor() {
		this.entries = [];
	}

	/* --- Getters -------------------------------------------------------------------------------------------------- */
	public get length() : number { return this.entries.length; }

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	public map<U>(callbackFn: (value: CommandHistory, index: number, array: CommandHistory[]) => U, thisArg?: any) : U[] {
		return this.entries.map(callbackFn, thisArg);
	}

	public next() : CommandHistory | null {
		this.cursor = Math.max((this.cursor - 1), -1);
		if (this.cursor < 0) return null;

		return this.entries[this.cursor];
	}

	public prev() : CommandHistory | null {
		this.cursor = Math.min((this.cursor + 1), (this.entries.length - 1));
		return this.entries[this.cursor];
	}

	public push(command: string, output: string) : void {
		this.resetCursor();

		this.entries.unshift({ command, output });
		this.preventOverflow();
	}

	public clear() : void {
		this.entries.length = 0;
		this.resetCursor();
	}

	private resetCursor() : void { this.cursor = -1; }

	private preventOverflow() : void {
		if (this.entries.length > LogoHistory.MAX_LENGTH) {
			this.entries = this.entries.slice(0, LogoHistory.MAX_LENGTH);
		}
	};
}