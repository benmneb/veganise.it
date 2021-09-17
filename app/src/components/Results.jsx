import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { styled } from '@mui/material';

import { ResultCard } from './index';
import { api, spaceout, scrollToResults } from '../utils';
import { setLoadingSearch, setSearchData, showSnackbar } from '../state';

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
	const searchData = useSelector((state) => state.searchData);
	const { term: rawTerm } = useParams();

	const term = spaceout(rawTerm);

	// perform search based on url params
	useEffect(() => {
		(async () => {
			try {
				const response = await api.get(`/search/${term}`);
				dispatch(setSearchData({ term, ...response.data }));
				dispatch(setLoadingSearch(false));
				scrollToResults();
			} catch (error) {
				console.error('While searching:', error);
				dispatch(setLoadingSearch(false));
				dispatch(
					showSnackbar({
						message: 'Could not search! Try again soon.',
						severity: 'error',
					})
				);
			}
		})();
	}, [term, dispatch]);

	// set searchData to null on return to base url
	useEffect(() => {
		return () => dispatch(setSearchData(null));
	}, [dispatch]);

	return (
		<Grid>
			{searchData?.results.map((recipe) => (
				<ResultCard key={recipe._id} recipe={recipe} />
			))}
		</Grid>
	);
}
