"use client";

import { UnclosedScope, UnnamedScope } from "@/exceptions";
import type {FoundScopes, Keyword} from "@/utils/LogoInterpreter/LogoScopes/LogoScopes.types";

class _LogoScope {
	public static readonly keyword: Keyword;
	protected name: string;
	public static readonly description: string | null;
	protected code: string;

	protected constructor(code: string) {
		this.name = "NameNotExtracted";
		this.code = code;

		this.extractName();
	}

	public extractName() : void {};
}
export type LogoScope = typeof _LogoScope;

export function LogoScope(keyword: Keyword, description?: string) {
	return class extends _LogoScope {
		public static readonly keyword: Keyword = keyword;
		public static readonly description: string | null = description ?? null;
	};
}

/*************************************************************
 * Scopes
 *************************************************************/
class FunctionScope extends LogoScope({ start: "POUR", end: "FIN" }, "Définit une fonction. Exemple : POUR NomFonction :param1 :param2\n    ....\nFIN") {
	constructor(code: string) {
		super(code);
	}

	public extractName() : void {
		const regex: RegExp = new RegExp(`^${FunctionScope.keyword.start}\\s+(\\S+)\\s*`);
		const matches: RegExpMatchArray | null = this.code.match(regex);

		if (!matches || matches.length < 2) {
			throw new UnnamedScope();
		}

		this.name = matches[1];
	}
}

/*************************************************************
 * Scope finder
 *************************************************************/
export class ScopeFinder {
	private static readonly SCOPES: { [key: string]: LogoScope } = {
		[FunctionScope.name]: FunctionScope
	};

	public find(code: string) : FoundScopes {
		const foundScopes: FoundScopes = {
			scopes: {},
			unscopedCode: code
		};

		for (const scopeClass of Object.values(ScopeFinder.SCOPES)) {
			const startIndexes: number[] = this.findAllIndexes(foundScopes.unscopedCode, scopeClass.keyword.start);
			const endIndexes: number[] = this.findAllIndexes(foundScopes.unscopedCode, scopeClass.keyword.end);

			if (startIndexes.length !== endIndexes.length) {
				throw new UnclosedScope(startIndexes.length, endIndexes.length);
			}

			if (startIndexes.length === 0) continue;

			for (let idx = 0; idx < startIndexes.length; idx++) {
				const from: number = startIndexes[idx];
				const to: number = endIndexes[idx] + scopeClass.keyword.end.length;

				const scope: LogoScope = new scopeClass(foundScopes.unscopedCode.substring(from, (to + 1)));

				foundScopes.scopes[scope.name] = scope;
			}

			let removedChars: number = 0;
			for (let idx = 0; idx < startIndexes.length; idx++) {
				const from: number = (startIndexes[idx]) - removedChars;
				const to: number = (endIndexes[idx] + scopeClass.keyword.end.length) - removedChars;

				const previousLength: number = foundScopes.unscopedCode.length;
				foundScopes.unscopedCode = foundScopes.unscopedCode.slice(0, from) + foundScopes.unscopedCode.slice((to + 1), foundScopes.unscopedCode.length);
				removedChars = previousLength - foundScopes.unscopedCode.length;
			}
		}

		return foundScopes;
	}

	private findAllIndexes(str: string, searchStr: string) : number[] {
		const indexes: number[] = [];
		let currentIndex: number = -1;

		while ((currentIndex = str.indexOf(searchStr, (currentIndex + 1))) !== -1) {
			indexes.push(currentIndex);
		}

		return indexes;
	}
}