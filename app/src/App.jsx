import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import { Switch, Route, useLocation } from 'react-router-dom';

import { Home, Recipe, Modal } from './components';
import { useTheme } from './assets';

export default function App() {
	const theme = useTheme();
	const location = useLocation();

	const background = location.state?.background;

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Switch location={background || location}>
				<Route path="/recipe/:id" children={<Recipe />} />
				<Route path="/" children={<Home />} />
			</Switch>
			<Route
				path="/recipe/:id"
				children={<Modal open={Boolean(background)} />}
			/>
		</ThemeProvider>
	);
}
