import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

export function scrollToResults() {
	const element = document.getElementById('caption');
	const offset = 37; // + 1 because of `adjustForSearchBar()`
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition - offset;

	function adjustForSearchBar() {
		if (window.scrollY.toFixed() !== offsetPosition.toFixed()) return;

		window.removeEventListener('scroll', adjustForSearchBar);
		window.scrollBy({
			top: 1,
			behavior: 'smooth',
		});
	}

	window.addEventListener('scroll', adjustForSearchBar);
	adjustForSearchBar();

	window.scrollTo({
		top: offsetPosition,
		behavior: 'smooth',
	});
}
