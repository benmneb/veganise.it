import { useReactiveVar } from '@apollo/client';

import { styled, Typography } from '@mui/material';

import { searchResultsVar } from '../cache';

const Wrapper = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	textAlign: 'center',
	marginBottom: theme.spacing(5),
	'& h3': {
		maxWidth: 1000,
	},
}));

const defaultText =
	'A curated collection of mouth-watering recipes to help you cook the best plant-based meals easier than ever.';

export default function Caption() {
	const searchResults = useReactiveVar(searchResultsVar);

	const resultsText = `Found ${searchResults?.search?.length} vegan recipes`;

	const visibleText = searchResults.search ? resultsText : defaultText;

	return (
		<Wrapper>
			<Typography variant="h4" component="h3">
				{visibleText}
			</Typography>
		</Wrapper>
	);
}
