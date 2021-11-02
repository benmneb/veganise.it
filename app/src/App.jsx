import useAckee from 'use-ackee';

import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { Switch, Route, useLocation } from 'react-router-dom';

import {
	Home,
	Recipe,
	Submit,
	Modal,
	Advertise,
	Snackbars,
} from './components';
import { theme } from './assets';

export default function App() {
	const location = useLocation();

	const background = location.state?.background;

	useAckee(
		location.pathname,
		{
			server: 'https://acklytics.vercel.app',
			domainId: '20c9632e-7665-4981-8254-3b7c01ccc0bd',
		},
		{
			detailed: true,
			ignoreLocalhost: true,
			ignoreOwnVisits: true,
		}
	);

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
