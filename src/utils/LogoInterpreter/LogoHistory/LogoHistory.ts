export default class LogoHistory {
	private entries: string[];
	private cursor: number = -1;
	private static readonly MAX_LENGTH: number = 1000;

	constructor() {
		this.entries = [];
	}

	/* --- Getters -------------------------------------------------------------------------------------------------- */
	public get length() : number { return this.entries.length; }

	public getLast() : string | null {
		if (this.entries.length > 0) {
			return this.entries[this.entries.length - 1];
		}

		return null;
	}

	/* --- Functions ------------------------------------------------------------------------------------------------ */
	public map<U>(callbackFn: (value: string, index: number, array: string[]) => U, thisArg?: any) : U[] {
		return this.entries.map(callbackFn, thisArg);
	}

	public next() : string | null {
		const nextCursor: number = this.cursor - 1;
		if (nextCursor < 0) return null;

		this.cursor = nextCursor;
		return this.entries[this.cursor];
	}

	public prev() : string | null {
		const prevCursor: number = this.cursor + 1;
		if (prevCursor >= (this.entries.length - 1)) return null;

		this.cursor = prevCursor;
		return this.entries[this.cursor];
	}

	public push(entry: string) : void {
		this.resetCursor();

		this.entries.unshift(entry);
		this.preventOverflow();
	}

	private resetCursor() : void { this.cursor = -1; }

	private preventOverflow() : void {
		if (this.entries.length > LogoHistory.MAX_LENGTH) {
			this.entries = this.entries.slice(0, LogoHistory.MAX_LENGTH);
		}
	};
}