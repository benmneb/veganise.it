import { useReactiveVar } from '@apollo/client';

import { styled } from '@mui/material';

import { ResultCard } from './index';
import { searchResultsVar } from '../cache';

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
	const searchResults = useReactiveVar(searchResultsVar);

	if (!searchResults) return null;

	return (
		<Grid>
			{searchResults?.search?.map((recipe) => (
				<ResultCard key={recipe._id} recipe={recipe} />
			))}
		</Grid>
	);
}
