export function downloadTextFile(filename: string, data: string) : void {
	const blob: Blob = new Blob([ data ], { type: "text/plain" });

	if (window?.navigator?.msSaveBlob) { // IE 10
		window.navigator.msSaveBlob(blob, filename);
	} else { // Other browsers
		const trigger: HTMLAnchorElement = window.document.createElement("a");
		trigger.href = window.URL.createObjectURL(blob);
		trigger.download = filename;

		document.body.appendChild(trigger);
		trigger.click();
		document.body.removeChild(trigger);
	}
}

export function bytesToHumanReadable(bytes: number, decimals: number = 1, metricSystem: boolean = true) : string {
	const threshold: number = metricSystem ? 1000 : 1024;

	if (Math.abs(bytes) < threshold) {
		return `${bytes} o`;
	}

	const units: string[] = metricSystem
		? [ "ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo" ]
		: [ "Kio", "Mio", "Gio", "Tio", "Pio", "Eio", "Zio", "Yio" ];
	let unitIdx: number = -1;
	const r: number = 10 ** decimals;

	do {
		bytes /= threshold;
		++unitIdx;
	} while ((Math.round(Math.abs(bytes) * r) / r >= threshold) && (unitIdx < (units.length - 1)));

	return `${bytes.toFixed(decimals)} ${units[unitIdx]}`;
}