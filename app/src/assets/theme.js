import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { green, pink } from '@mui/material/colors';

const pseudoStyleOverrides = {
	root: {
		'&:active': {
			backgroundColor: 'rgba(0, 0, 0, 0.54)',
		},
		'&:focus-visible': {
			boxShadow:
				'0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5)',
			outline: 'none',
		},
	},
};

export const theme = responsiveFontSizes(
	createTheme({
		palette: {
			primary: green,
			secondary: { main: '#1a90ff' },
			favorite: { main: pink[400] },
			youtube: { main: '#FF0000' },
		},
		typography: {
			fontFamily: ['Nunito', 'sans-serif'].join(','),
			fontWeightMedium: 600,
			fontWeightBold: 800,
			h1: {
				fontWeight: 800,
			},
			h2: {
				fontWeight: 800,
			},
			h3: {
				fontWeight: 800,
			},
			h4: {
				fontWeight: 800,
			},
			h5: {
				fontWeight: 800,
			},
			h6: {
				fontWeight: 800,
			},
			body1: {
				fontWeight: 600,
			},
			button: {
				fontWeight: 600,
				textTransform: 'none',
			},
		},
		breakpoints: {
			values: {
				mobile: 0,
				tablet: 750,
				desktop: 1280,
				hd: 1920,
			},
		},
		shape: {
			borderRadius: 16,
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						userSelect: 'none',
						'& ::selection': {
							backgroundColor: green[500],
							color: 'white',
						},
					},
				},
			},
			MuiButtonBase: {
				defaultProps: {
					disableRipple: true,
				},
			},
			MuiButton: {
				styleOverrides: pseudoStyleOverrides,
			},
			MuiIconButton: {
				styleOverrides: pseudoStyleOverrides,
			},
			MuiMenuItem: {
				styleOverrides: pseudoStyleOverrides,
			},
			MuiUseMediaQuery: {
				defaultProps: {
					noSsr: true,
				},
			},
		},
	}),
	{ breakpoints: ['tablet', 'desktop', 'hd'] }
);
