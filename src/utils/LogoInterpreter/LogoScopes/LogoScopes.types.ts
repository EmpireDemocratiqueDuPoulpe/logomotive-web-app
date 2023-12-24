import type { _LogoScope } from "./LogoScopes";

/// --- Types ----------------------------------------------------------------------------------------------------------
export type Keyword = {
	start: string
	end: string
}

export type FoundScopes = {
	scopes: { [key: string]: _LogoScope }
	unscopedCode: string
}