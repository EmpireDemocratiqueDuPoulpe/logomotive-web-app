export default class UnnamedScope extends Error {
	public constructor() {
		super("Error: This scope must have a name!");
	}
}