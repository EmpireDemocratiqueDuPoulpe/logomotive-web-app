export default class InvalidInstruction extends Error {
	public constructor() {
		super("Error: Invalid instruction! Need help? Try the \"HELP\" command.");
	}
}