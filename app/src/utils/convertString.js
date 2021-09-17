// to remove everything except letters and numbers
// and replace space(s) with a dash

export function kebab(string) {
	return (
		string
			.trim()
			.replace(/\s+/g, '-')
			// .replace(/-+/g, '-')
			.replace(/[^a-zA-Z0-9-]/g, '')
			.toLowerCase()
	);
}

// to replace dashes with spaces
// and `.toLowerCase()` incase they typed it straight into the address bar

export function spaceout(string) {
	return string.replace(/-+/g, ' ').toLowerCase();
}

// used to compare raw input with redux searchData.term

export function clean(string) {
	return string
		.replace(/-+/g, ' ')
		.replace(/\s+/g, ' ')
		.replace(/[^a-zA-Z0-9-\s]/g, '')
		.toLowerCase()
		.trim();
}
