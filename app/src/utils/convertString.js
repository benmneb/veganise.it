// to remove everything except letters and numbers
// and replace space(s) with a dash

export function kebab(string) {
	return string
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/[^a-zA-Z0-9-"]/g, '')
		.toLowerCase();
}

// to replace dashes with spaces
// and `.toLowerCase()` incase they typed it straight into the address bar

export function spaceout(string) {
	return string
		.replace(/-+/g, ' ')
		.replace(/[^a-zA-Z0-9-\s"]/g, '')
		.toLowerCase()
		.trim();
}

// used to compare raw input with redux searchData.term

export function clean(string) {
	return string
		.replace(/-+/g, ' ')
		.replace(/\s+/g, ' ')
		.replace(/[^a-zA-Z0-9-\s"]/g, '')
		.toLowerCase()
		.trim();
}

// removes quotes

export function dequote(string) {
	return string.replace(/^"/, '').replace(/"$/, '');
}

// to title case
// slightly modified from https://stackoverflow.com/a/6475125/12104850

export function titlise(string) {
	let i, j, str, lowers, uppers;

	str = string.replace(
		/([^\W_]+[^\s-]*) */g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	);

	// Certain minor words should be left lowercase unless
	// they are the first or last words in the string
	lowers = [
		'A',
		'An',
		'The',
		'And',
		'But',
		'Or',
		'For',
		'Nor',
		'As',
		'At',
		'By',
		'For',
		'From',
		'In',
		'Into',
		'Near',
		'Of',
		'On',
		'Onto',
		'To',
		'With',
		'This',
		'Min',
	];

	for (i = 0, j = lowers.length; i < j; i++)
		str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), (txt) =>
			txt.toLowerCase()
		);

	// Certain words such as initialisms or acronyms should be left uppercase
	uppers = ['Id', 'Tv', 'Bbq'];

	for (i = 0, j = uppers.length; i < j; i++)
		str = str.replace(
			new RegExp('\\b' + uppers[i] + '\\b', 'g'),
			uppers[i].toUpperCase()
		);

	return str;
}
