function colorToHex(color: number | string) : string {
	const hex: string = parseInt(("" + color), 10).toString(16);
	return (hex.length === 1) ? `0${hex}` : hex;
}
export function RGBToHex(r: number | string, g: number | string, b: number | string) : string {
	return `#${colorToHex(r)}${colorToHex(g)}${colorToHex(b)}`;
}