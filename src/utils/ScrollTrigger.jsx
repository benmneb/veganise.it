import { createElement } from 'react';

import PropTypes from 'prop-types';

import { useScrollTrigger, Grow, Slide, Zoom } from '@mui/material';

export default function ScrollTrigger(props) {
	const {
		children,
		threshold,
		disableHysteresis,
		target,
		transition,
		disabled,
		onScroll,
	} = props;

	const trigger = useScrollTrigger({ threshold, disableHysteresis, target });

	const triggerStatus = onScroll === 'show' ? trigger : !trigger;

	function element() {
		if (transition === 'grow') return Grow;
		if (transition === 'slide') return Slide;
		if (transition === 'zoom') return Zoom;
	}

	return createElement(
		element(),
		{ appear: false, in: disabled || triggerStatus },
		children
	);
}

ScrollTrigger.propTypes = {
	children: PropTypes.node.isRequired,
	threshold: PropTypes.number,
	disableHysteresis: PropTypes.bool,
	target: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
	transition: PropTypes.oneOf(['slide', 'grow', 'zoom']),
	onScroll: PropTypes.oneOf(['show', 'hide']),
};

ScrollTrigger.defaultProps = {
	threshold: 100,
	disableHysteresis: false,
	target: window,
	transition: 'grow',
	onScroll: 'hide',
};
