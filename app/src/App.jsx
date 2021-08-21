import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import { Switch, Route, useLocation } from 'react-router-dom';

import { Home, Results, Recipe, Modal } from './components';
import { useTheme } from './assets';

export default function App() {
	const theme = useTheme();
	const location = useLocation();

	const background = location.state?.background;

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Switch location={background || location}>
				<Route exact path="/" children={<Home />} />
				<Route exact path="/search/:term" children={<Results />} />
				<Route path="/recipe/:id" children={<Recipe />} />
			</Switch>
			<Route
				path="/recipe/:id"
				children={<Modal open={Boolean(background)} />}
			/>
		</ThemeProvider>
	);
}
