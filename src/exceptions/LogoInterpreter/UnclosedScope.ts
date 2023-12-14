export default class UnclosedScope extends Error {
	public constructor(scopeStartCount: number, scopeEndCount: number) {
		super(`Error: It seems that there is a difference between opened scopes and closed ones. You have ${scopeStartCount} scope(s) opened and ${scopeEndCount} scope(s) closed.`);
	}
}