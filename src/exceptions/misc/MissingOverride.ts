export default class MissingOverride extends Error {
	public constructor() {
		super("Error: This static function should be overridden!");
	}
}