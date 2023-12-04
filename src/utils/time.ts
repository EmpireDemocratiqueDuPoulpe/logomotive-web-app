export function isoDateTimeToHumanReadable(isoDateTime: string, withTime: boolean = true, locale: string = "fr-FR") : string {
	const date: Date = new Date(isoDateTime);
	let localDate: string = date.toLocaleDateString(locale);

	if (withTime) {
		localDate += ` ${date.toLocaleTimeString(locale)}`;
	}

	return localDate;
}