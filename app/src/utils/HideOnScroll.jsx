import PropTypes from 'prop-types';

import { useScrollTrigger, Grow } from '@material-ui/core/';

export default function HideOnScroll(props) {
	const { children, threshold, disableHysteresis, target } = props;

	const trigger = useScrollTrigger({ threshold, disableHysteresis, target });

	return (
		<Grow appear={false} in={!trigger}>
			{children}
		</Grow>
	);
}

HideOnScroll.propTypes = {
	children: PropTypes.node.isRequired,
	threshold: PropTypes.number,
	disableHysteresis: PropTypes.bool,
	target: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
};

HideOnScroll.defaultProps = {
	threshold: 100,
	disableHysteresis: false,
	target: window,
};
