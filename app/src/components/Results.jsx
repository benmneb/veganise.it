import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { styled } from '@mui/material';

import { ResultCard } from './index';
import { api, spaceout } from '../utils';
import { setSearchResults } from '../state';

const Grid = styled('section')(({ theme }) => ({
	width: '100%',
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
	gridGap: theme.spacing(6),
	[theme.breakpoints.only('mobile')]: {
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
	},
}));

export default function Results() {
	const dispatch = useDispatch();
	const searchResults = useSelector((state) => state.searchResults);
	const { term: rawTerm } = useParams();

	const term = spaceout(rawTerm);

	// perform search based on url params
	useEffect(() => {
		(async () => {
			const response = await api.get(`/search/${term}`);
			dispatch(setSearchResults({ term, ...response.data }));
		})();
	}, [term, dispatch]);

	// set searchData to null on return to base url
	useEffect(() => {
		return () => dispatch(setSearchResults(null));
	}, [dispatch]);

	return (
		<Grid>
			{searchResults?.data.map((recipe) => (
				<ResultCard key={recipe._id} recipe={recipe} />
			))}
		</Grid>
	);
}
