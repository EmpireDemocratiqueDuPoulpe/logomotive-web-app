import type { LogoScope } from "./LogoScopes";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type Keyword = {
	start: string
	end: string
}

export type FoundScopes = {
	scopes: { [key: string]: LogoScope }
	unscopedCode: string
}