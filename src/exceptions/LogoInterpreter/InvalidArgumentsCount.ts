export default class InvalidArgumentsCount extends Error {
	public constructor(expectedArgs: number, got: number) {
		super(`Error: ${expectedArgs < got ? "Missing" : "Too many"} arguments! Expected ${expectedArgs} ${expectedArgs === 1 ? "argument" : "arguments"}, got ${got}.`);
	}
}