import { styled, Link as MuiLink, useMediaQuery } from '@mui/material';

const MyLink = styled(MuiLink, {
	shouldForwardProp: (prop) => prop !== 'noHover',
})(({ noHover, theme }) => ({
	textDecoration: 'none',
	color: theme.palette.text.primary,
	boxShadow: `inset 0 ${noHover ? '-3px' : '0'} 0 ${
		theme.palette.primary.main
	}`,
	transitionProperty: 'box-shadow, color',
	transitionDuration: `${theme.transitions.duration.short}ms, ${theme.transitions.duration.complex}ms`,
	transitionTimingFunction: `${theme.transitions.easing.easeInOut}`,
	'&:hover': {
		color:
			theme.palette.type === 'dark'
				? theme.palette.primary.contrastText
				: theme.palette.common.white,
		boxShadow: `inset 0 -1.35rem 0 ${theme.palette.primary.main}`,
	},
}));

export function Link(props) {
	const { children, ...other } = props;
	const noHover = useMediaQuery('@media (hover: none)');

	return (
		<MyLink noHover={noHover} {...other}>
			{children}
		</MyLink>
	);
}
