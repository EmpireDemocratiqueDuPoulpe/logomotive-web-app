import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [ nextui({
		themes: {
			light: {
				colors: {
					background: "#FFFFFF",
					foreground: "#11181C",
					primary: {
						50: "#EEEBFF",
						100: "#CDBEFE",
						200: "#B193FD",
						300: "#9D6CFB",
						400: "#8F4CF7",
						500: "#8433F2",
						600: "#7B20E9",
						700: "#6F11D7",
						800: "#5807AD",
						900: "#36026B",
						foreground: "#FFFFFF",
						DEFAULT: "#8E3BE1"
					},
					secondary: {
						50: "#E6F1FE",
						100: "#CCE3FD",
						200: "#99C7FB",
						300: "#66AAF9",
						400: "#338EF7",
						500: "#006FEE",
						600: "#005BC4",
						700: "#004493",
						800: "#002E62",
						900: "#001731",
						DEFAULT: "#0070F0",
						foreground: "#ffffff",
					}
				}
			},
			dark: {
				colors: {
					background: "#000000",
					foreground: "#ECEDEE",
					primary: {
						50: "#EEEBFF",
						100: "#CDBEFE",
						200: "#B193FD",
						300: "#9D6CFB",
						400: "#8F4CF7",
						500: "#8433F2",
						600: "#7B20E9",
						700: "#6F11D7",
						800: "#5807AD",
						900: "#36026B",
						foreground: "#FFFFFF",
						DEFAULT: "#8E3BE1"
					},
					secondary: {
						50: "#E6F1FE",
						100: "#CCE3FD",
						200: "#99C7FB",
						300: "#66AAF9",
						400: "#338EF7",
						500: "#006FEE",
						600: "#005BC4",
						700: "#004493",
						800: "#002E62",
						900: "#001731",
						DEFAULT: "#0070F0",
						foreground: "#ffffff",
					}
				}
			}
		}
	}) ],
};