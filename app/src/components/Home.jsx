import { Route } from 'react-router';

import { styled } from '@material-ui/core';

import { Search, Results, Header, Caption } from './index';

const Main = styled('main')(({ theme }) => ({
	margin: theme.spacing(4),
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
}));

export default function Home() {
	return (
		<>
			<Header />
			<Main>
				<Search />
				<Caption />
				<Route exact path="/:term">
					<Results />
				</Route>
			</Main>
		</>
	);
}
