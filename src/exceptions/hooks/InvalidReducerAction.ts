export default class InvalidReducerAction extends Error {
	public constructor(invalidActionName?: string) {
		super(`useReducer: Invalid action provided!${invalidActionName ? `"${invalidActionName}" is not a valid action type.` : ""}`);
	}
}