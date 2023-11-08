import type { CommandHistory, HistoryListener } from "./LogoHistory.types";

export default class LogoHistory {
	private entries: CommandHistory[];
	private cursor: number = -1;
	private static readonly MAX_LENGTH: number = 1000;
	private listeners: HistoryListener[] = [];

	constructor() {
		this.entries = [];
	}

	/* --- Getters -------------------------------------------------------------------------------------------------- */
	public get length() : number { return this.entries.length; }

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	public registerListener(callback: HistoryListener) : void {
		this.listeners.push(callback);
	}

	public unregisterListener(callback: HistoryListener) : void {
		const listenerIdx: number = this.listeners.indexOf(callback);

		if (listenerIdx !== -1) {
			this.listeners.splice(listenerIdx, 1);
		}
	}

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
		this.notifyListeners();
	}

	public clear() : void {
		this.entries.length = 0;
		this.resetCursor();
		this.notifyListeners();
	}

	private resetCursor() : void { this.cursor = -1; }

	private preventOverflow() : void {
		if (this.entries.length > LogoHistory.MAX_LENGTH) {
			this.entries = this.entries.slice(0, LogoHistory.MAX_LENGTH);
		}
	};

	private notifyListeners() : void {
		for (const listener of this.listeners) {
			listener(this.entries, this.length);
		}
	}
}