export default class InvalidReducerAction extends Error {
	constructor(public invalidActionName?: string) {
		super(`useReducer: Invalid action provided!${invalidActionName ? `"${invalidActionName}" is not a valid action type.` : ""}`);
	}
}