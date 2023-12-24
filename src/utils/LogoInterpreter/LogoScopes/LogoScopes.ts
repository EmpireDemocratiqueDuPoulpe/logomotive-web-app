"use client";

import { InvalidArgumentsCount, UnclosedScope, UnnamedScope } from "@/exceptions";
import type {FoundScopes, Keyword} from "@/utils/LogoInterpreter/LogoScopes/LogoScopes.types";
import LogoInterpreter from "@/utils/LogoInterpreter/LogoInterpreter";

export class _LogoScope {
	public static readonly keyword: Keyword;
	public name: string;
	public static readonly description: string | null;
	protected code: string;

	public constructor(code: string) {
		this.name = "NameNotExtracted";
		this.code = code;

		this.extractName();
	}

	public extractName() : void {};
	public execute(interpreter: LogoInterpreter, ...args: string[]) : string | void { return; }
}
export type LogoScope = typeof _LogoScope;

export function LogoScope(keyword: Keyword, description?: string) : typeof _LogoScope{
	return class extends _LogoScope {
		public static readonly keyword: Keyword = keyword;
		public static readonly description: string | null = description ?? null;

		public execute(interpreter: LogoInterpreter, ...args: string[]) : string | void { return; }
	};
}

/*************************************************************
 * Scopes
 *************************************************************/
export class FunctionScope extends LogoScope({ start: "POUR", end: "FIN" }, "Définit une fonction. Exemple : POUR NomFonction :param1 :param2\n    ....\nFIN") {
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

	public execute(interpreter: LogoInterpreter, ...args: string[]): string | void {
		interpreter.debugger.printFnCall(`Scope - execute[${FunctionScope.keyword.start}]`, "start");

		const scopeOut: string | void = this._execute(interpreter, ...args);

		interpreter.debugger.printFnCall(`Scope - execute[${FunctionScope.keyword.start}]`, "end");
		return scopeOut;
	}

	protected _execute(interpreter: LogoInterpreter, ...args: string[]): string | void {
		let instructions: string[] = this.code.split("\n").filter(Boolean);
		const parameters: ({ name: string, value: string })[] = [];

		const parametersMatch: RegExpMatchArray | null = instructions[0]
			.match(new RegExp(`${FunctionScope.keyword.start}\\s+${this.name}\\s+(:)`));

		if (parametersMatch) {
			const parametersIdx: number = instructions[0].indexOf(parametersMatch[1]);
			const parametersDefinition: string[] = instructions[0].slice(parametersIdx).split(/\s+/);

			if (args.length < parametersDefinition.length) {
				throw new InvalidArgumentsCount(parametersDefinition.length, args.length);
			}

			for (let idx = 0; idx < parametersDefinition.length; idx++) {
				parameters.push({ name: parametersDefinition[idx], value: args[idx] });
			}
		}

		instructions.shift();
		instructions.pop();

		instructions = instructions.map((instruction: string): string => {
			let filledInstruction: string = instruction.trim();

			for (const parameter of parameters) {
				if (instruction.includes(parameter.name)) {
					filledInstruction = filledInstruction.replaceAll(parameter.name, parameter.value);
				}
			}

			return filledInstruction;
		});

		instructions.forEach((i: string) => interpreter.executeInstruction(i));
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

				// @ts-ignore
				const scope: _LogoScope = new scopeClass(foundScopes.unscopedCode.substring(from, (to + 1)));

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