export default class MissingContextProvider extends Error {
	public constructor(providerName?: string) {
		super(`No context provider found!${providerName ? `This hook must be used in a child component of "${providerName}".` : ""}`);
	}
}