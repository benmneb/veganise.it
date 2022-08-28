import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

export function scrollToResults() {
	const element = document.getElementById('caption');
	const offset = 37; // + 1 because of `adjustForSearchBar()`
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition - offset;

	// This function scrolls the page down one pixel to make the search bar
	// disappear when searching from somwhere down in the results list.
	// It often causes inital scroll glitch on Safari because Safari is the new IE.
	function adjustForSearchBar() {
		if (Number(window.scrollY).toFixed() === Number(offsetPosition).toFixed()) {
			window.removeEventListener('scroll', adjustForSearchBar);
			return window.scrollBy({
				top: 1,
				behavior: 'smooth',
			});
		}
	}

	window.addEventListener('scroll', adjustForSearchBar);
	adjustForSearchBar();

	window.scrollTo({
		top: offsetPosition,
		behavior: 'smooth',
	});
}
