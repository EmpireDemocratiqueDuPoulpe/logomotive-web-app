import { Inter } from "next/font/google";
import type { NextFont } from "next/dist/compiled/@next/font";
import type { FontsConstants } from "@/constants/fonts.types";

const inter: NextFont = Inter({ subsets: ["latin"] });

const ALL: FontsConstants = {
	CLASSNAMES: [inter].map((f: NextFont) => f.className).join(" ")
};

export default ALL;