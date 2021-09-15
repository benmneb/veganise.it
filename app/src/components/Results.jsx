import { useEffect, useRef } from 'react';

import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material';

import { ResultCard } from './index';
import { search } from '../state';

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
	const { term } = useParams();
	const dispatch = useDispatch();
	const searchResults = useSelector((state) => state.searchResults);
	const firstMount = useRef(true);

	// enable search from url
	useEffect(() => {
		if (!firstMount.current) return;
		firstMount.current = false;

		dispatch(search(term, 'url'));
	}, [term, dispatch]);

	if (!searchResults?.data) return null;

	return (
		<Grid>
			{searchResults?.data.map((recipe) => (
				<ResultCard key={recipe._id} recipe={recipe} />
			))}
		</Grid>
	);
}
