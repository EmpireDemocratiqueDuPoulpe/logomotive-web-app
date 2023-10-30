import { Inter, Fira_Code, Fira_Mono } from "next/font/google";
import type { NextFont } from "next/dist/compiled/@next/font";
import type { FontsConstants } from "@/constants/fonts.types";

const inter: NextFont = Inter({ subsets: ["latin"] });
const firaCode: NextFont = Fira_Code({ subsets: ["latin"] });
const firaMono: NextFont = Fira_Mono({ subsets: ["latin"], weight: "400" });

const ALL: FontsConstants = {
	CLASSNAMES: [inter, firaCode, firaMono].map((f: NextFont) => f.className).join(" ")
};

export default ALL;