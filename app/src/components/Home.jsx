import { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { Route, useHistory } from 'react-router-dom';

import { styled } from '@mui/material';

import { Search, Results, Header, Caption } from './index';

const Main = styled('main')(({ theme }) => ({
	margin: theme.spacing(4),
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
}));

export default function Home() {
	const history = useHistory();
	const searchResults = useSelector((state) => state.searchResults);

	// respond to update in state.searchResults to display results
	useEffect(() => {
		if (!searchResults) return; // ie. initial load
		if (history?.location?.state) return; // this stops it running when liking a recipe
		if (searchResults.source === 'appbar') return;
		if (searchResults.source === 'url') return;

		const urlTerm = searchResults.term
			.trim()
			.replace(/\s+/g, '-')
			.toLowerCase();

		history.push(`/${urlTerm}`);
	}, [searchResults, history]);

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
