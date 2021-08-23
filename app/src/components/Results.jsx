import { styled } from '@material-ui/core';

import { useReactiveVar } from '@apollo/client';

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
	// const { loading, error, data } = useQuery(GET_RECIPES);

	const searchResults = useReactiveVar(searchResultsVar);

	// if (loading) return 'Loading...';
	// if (error) return `Error: ${error.message}`;

	if (searchResults)
		return (
			<Grid>
				{searchResults?.search?.map((recipe) => (
					<ResultCard key={recipe._id} recipe={recipe} />
				))}
			</Grid>
		);

	return null;

	// return (
	// 	<Grid>
	// 		{data?.recipes.map((recipe) => (
	// 			<ResultCard key={recipe._id} recipe={recipe} />
	// 		))}
	// 	</Grid>
	// );
}
