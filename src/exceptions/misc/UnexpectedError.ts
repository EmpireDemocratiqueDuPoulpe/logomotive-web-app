export default class UnexpectedError extends Error {
	public constructor(message: string) {
		super(`Unexpected error: ${message}`);
	}
}