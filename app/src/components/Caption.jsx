import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { styled, Typography } from '@mui/material';

const Wrapper = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	textAlign: 'center',
	marginBottom: theme.spacing(5),
	'& h3': {
		maxWidth: 1000,
	},
}));

const defaultCaption =
	'A curated collection of mouth-watering recipes to help you cook the best plant-based meals easier than ever.';

export default function Caption() {
	const [caption, setCaption] = useState(defaultCaption);
	const searchResults = useSelector((state) => state.searchResults);

	useEffect(() => {
		if (!searchResults?.data) return setCaption(defaultCaption);

		setCaption(
			`${searchResults?.data?.length} vegan "${searchResults.term}" recipes`
		);
	}, [searchResults]);

	return (
		<Wrapper>
			<Typography variant="h4" component="h3">
				{caption}
			</Typography>
		</Wrapper>
	);
}
