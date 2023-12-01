export default class InvalidCommand extends Error {
	public constructor() {
		super("Error: Invalid instruction! Need help? Try the \"HELP\" command.");
	}
}