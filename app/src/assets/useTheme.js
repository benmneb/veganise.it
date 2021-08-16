import { useMemo } from 'react';
import { useMediaQuery } from '@material-ui/core';
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

export function useTheme() {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = useMemo(
		() =>
			responsiveFontSizes(
				createTheme({
					palette: {
						mode: prefersDarkMode ? 'dark' : 'light',
						primary: green,
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
						body1: {
							fontWeight: 600,
						},
						button: {
							fontWeight: 600,
							textTransform: 'none',
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
					},
				})
			),
		[prefersDarkMode]
	);

	return theme;
}
