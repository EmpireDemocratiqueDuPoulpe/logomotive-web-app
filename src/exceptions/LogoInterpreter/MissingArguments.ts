export default class MissingArguments extends Error {
	public constructor(expectedArgs: number, got: number) {
		super(`Error: Missing arguments! Expected ${expectedArgs} ${expectedArgs === 1 ? "argument" : "arguments"}, got ${got}.`);
	}
}