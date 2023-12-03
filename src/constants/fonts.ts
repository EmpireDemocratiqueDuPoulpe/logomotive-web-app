import { Fira_Code, Fira_Mono, Noto_Sans } from "next/font/google";
import type { NextFont } from "next/dist/compiled/@next/font";

export const notoSans: NextFont = Noto_Sans({
	subsets: ["latin"],
	weight: ["400", "700"],
	display: "auto"
});

export const firaCode: NextFont = Fira_Code({
	subsets: ["latin"],
	display: "swap"
});
export const firaMono: NextFont = Fira_Mono({
	subsets: ["latin"],
	weight: "400",
	display: "fallback"
});

const FONTS = { notoSans, firaCode, firaMono };
export default FONTS;