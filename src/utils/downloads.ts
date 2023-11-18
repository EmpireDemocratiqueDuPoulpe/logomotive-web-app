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