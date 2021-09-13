import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { green, pink } from '@mui/material/colors';

export const theme = responsiveFontSizes(
	createTheme({
		palette: {
			primary: green,
			favorite: { main: pink[400] },
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
				styleOverrides: `
								body {
									user-select: none;
								}
							`,
			},
			MuiButtonBase: {
				defaultProps: {
					disableRipple: true,
				},
			},
			MuiButton: {
				styleOverrides: {
					root: {
						'&:active': {
							backgroundColor: 'rgba(0, 0, 0, 0.54)',
						},
					},
				},
			},
			MuiIconButton: {
				styleOverrides: {
					root: {
						'&:active': {
							backgroundColor: 'rgba(0, 0, 0, 0.54)',
						},
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						'&:active': {
							backgroundColor: 'rgba(0, 0, 0, 0.54)',
						},
					},
				},
			},
		},
	}),
	{ breakpoints: ['tablet', 'desktop', 'hd'] }
);
