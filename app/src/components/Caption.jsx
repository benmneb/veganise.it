import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { styled, Typography } from '@mui/material';

import { dequote } from '../utils';

const Wrapper = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	textAlign: 'center',
	'& h3': {
		maxWidth: 1000,
	},
}));

const defaultCaption =
	"A curated collection of the internet's most mouth-watering vegan recipes. The best plant-based meals just got easier.";

export default function Caption() {
	const [caption, setCaption] = useState(defaultCaption);

	const searchData = useSelector((state) => state.searchData);

	useEffect(() => {
		if (!searchData?.term) return setCaption(defaultCaption);

		setCaption(
			`${searchData?.totalCount} vegan "${dequote(searchData.term)}" recipes`
		);
	}, [searchData]);

	return (
		<Wrapper id="caption" sx={{ mb: searchData?.term ? 5 : 0 }}>
			<Typography variant="h4" component="h3">
				{caption}
			</Typography>
		</Wrapper>
	);
}
