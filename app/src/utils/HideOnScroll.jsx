import PropTypes from 'prop-types';

import { useScrollTrigger, Grow, Slide } from '@mui/material/';

export default function HideOnScroll(props) {
	const {
		children,
		threshold,
		disableHysteresis,
		target,
		transition,
		disabled,
	} = props;

	const trigger = useScrollTrigger({ threshold, disableHysteresis, target });

	if (transition === 'grow')
		return (
			<Grow appear={false} in={disabled || !trigger}>
				{children}
			</Grow>
		);

	return (
		<Slide appear={false} in={disabled || !trigger}>
			{children}
		</Slide>
	);
}

HideOnScroll.propTypes = {
	children: PropTypes.node.isRequired,
	threshold: PropTypes.number,
	disableHysteresis: PropTypes.bool,
	target: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
	transition: PropTypes.oneOf(['slide', 'grow']),
};

HideOnScroll.defaultProps = {
	threshold: 100,
	disableHysteresis: false,
	target: window,
	transition: 'grow',
};
