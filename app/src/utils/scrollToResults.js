import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

export function scrollToResults() {
	const element = document.getElementById('caption');
	const offset = 32;
	const bodyRect = document.body.getBoundingClientRect().top;
	const elementRect = element.getBoundingClientRect().top;
	const elementPosition = elementRect - bodyRect;
	const offsetPosition = elementPosition - offset;

	window.scrollTo({
		top: offsetPosition,
		behavior: 'smooth',
	});
}
