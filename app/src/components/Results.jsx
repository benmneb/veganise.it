import { styled } from '@material-ui/core';

import { gql, useQuery } from '@apollo/client';

import { ResultCard } from './index';

const Grid = styled('section')(({ theme }) => ({
	width: '100%',
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
	gridGap: theme.spacing(6),
	[theme.breakpoints.only('mobile')]: {
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
	},
	userSelect: 'none',
}));

const GET_RECIPES = gql`
	query Recipes {
		recipes {
			_id
			title
			author
			likes
		}
	}
`;

export default function Results() {
	const { loading, error, data } = useQuery(GET_RECIPES);

	if (loading) return 'Loading...';
	if (error) return `Error: ${error.message}`;

	return (
		<Grid>
			{data?.recipes.map((recipe) => (
				<ResultCard key={recipe._id} recipe={recipe} />
			))}
		</Grid>
	);
}
