import { useReactiveVar } from '@apollo/client';

import { styled, Typography } from '@material-ui/core';

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

export default function Caption(props) {
	const { children } = props;

	const searchResults = useReactiveVar(searchResultsVar);

	return (
		<Wrapper>
			<Typography variant="h4" component="h3">
				{searchResults?.search
					? `Found ${searchResults.search.length} vegan recipes`
					: children}
			</Typography>
		</Wrapper>
	);
}
