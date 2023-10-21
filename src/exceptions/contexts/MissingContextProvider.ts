export default class MissingContextProvider extends Error {
	constructor(public providerName?: string) {
		super(`No context provider found!${providerName ? `This hook must be used in a child component of "${providerName}".` : ""}`);
	}
}