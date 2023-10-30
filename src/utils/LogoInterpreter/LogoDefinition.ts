import Prism, { Grammar } from "prismjs";
import LogoCommands from "@/utils/LogoInterpreter/LogoCommands/LogoCommands";

export const languageName: string = "logo";
const languageDefinition: Grammar = {
	keyword: {
		pattern: new RegExp("((?:^|\\})\\s*)" + Object.keys(LogoCommands).reverse().join("|") + "\\b"),
		lookbehind: false
	},
	number: {
		pattern: /(^|[^\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?|\d+(?:_\d+)*n|(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?)(?![\w$])/
	}
};

Prism.languages[languageName] = languageDefinition;

export default Prism;