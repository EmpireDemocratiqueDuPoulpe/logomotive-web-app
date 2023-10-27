export default class InvalidCommand extends Error {
	public constructor() {
		super("Error: Invalid command! Need help? Try the \"HELP\" command.");
	}
}