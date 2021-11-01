import { useState, useEffect } from 'react';

import { useHistory } from 'react-router';

import { useSelector } from 'react-redux';

import { styled, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { searchSuggestData } from '../assets';
import { kebab } from '../utils';

const Wrapper = styled('section')({
	display: 'flex',
	justifyContent: 'center',
	flexWrap: 'wrap',
});

const Headings = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'center',
	margin: theme.spacing(5, 0, 3),
}));

const SuggestionButton = styled(LoadingButton)(({ theme }) => ({
	margin: theme.spacing(1),
	padding: theme.spacing(1, 3),
	fontSize: theme.typography.h4.fontSize,
	borderRadius: theme.spacing(3),
	borderColor: '#bdbdbd',
	'&.Mui-focusVisible': {
		// This is needed for Safari.
		boxShadow:
			'0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5)',
		outline: 'none',
	},
}));

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

const shuffledSuggestions = shuffle(searchSuggestData);

export default function Suggestions() {
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const searchData = useSelector((state) => state.searchData);

	function handleClick(term) {
		setLoading(term);
		history.push(`/${kebab(term)}`);
	}

	useEffect(() => {
		if (searchData?.results) setLoading(false);
	}, [searchData]);

	return (
		<>
			<Headings>
				<Typography variant="h5" component="h3">
					Popular searches:
				</Typography>
			</Headings>
			<Wrapper>
				{shuffledSuggestions.map((term) => (
					<SuggestionButton
						variant="outlined"
						color="inherit"
						key={term[0]}
						onClick={() => handleClick(term[0])}
						loading={loading === term[0]}
						loadingPosition={window.safari ? 'start' : 'center'}
						startIcon={term[1]}
					>
						<span style={{ display: 'none' }}>Vegan </span>
						{term[0]}
						<span style={{ display: 'none' }}> Recipes</span>
					</SuggestionButton>
				))}
			</Wrapper>
		</>
	);
}
