import { useMemo } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { green, pink } from '@material-ui/core/colors';

export function useTheme() {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = useMemo(
		() =>
			responsiveFontSizes(
				createTheme({
					palette: {
						mode: prefersDarkMode ? 'dark' : 'light',
						primary: green,
						success: { main: pink[400] },
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
					},
				}),
				{ breakpoints: ['tablet', 'desktop', 'hd'] }
			),
		[prefersDarkMode]
	);

	return theme;
}
