import PropTypes from 'prop-types';

import { useScrollTrigger, Grow, Slide } from '@material-ui/core/';

export default function HideOnScroll(props) {
	const { children, threshold, disableHysteresis, target, transition } = props;

	const trigger = useScrollTrigger({ threshold, disableHysteresis, target });

	return transition === 'grow' ? (
		<Grow appear={false} in={!trigger}>
			{children}
		</Grow>
	) : (
		<Slide appear={false} in={!trigger}>
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
