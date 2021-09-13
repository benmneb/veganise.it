import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import { Switch, Route, useLocation } from 'react-router-dom';

import {
	Home,
	Recipe,
	Submit,
	Modal,
	Advertise,
	Snackbars,
} from './components';
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
				<Route path="/advertise" children={<Advertise />} />
				<Route path="/submit" children={<Submit />} />
				<Route path="/" children={<Home />} />
			</Switch>
			<Route
				path="/recipe/:id"
				children={<Modal open={Boolean(background)} />}
			/>
			<Route
				path="/advertise"
				children={<Modal open={Boolean(background)} />}
			/>
			<Route path="/submit" children={<Modal open={Boolean(background)} />} />
			<Snackbars />
		</ThemeProvider>
	);
}
