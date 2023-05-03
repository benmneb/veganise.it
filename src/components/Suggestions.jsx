import { useEffect, useState } from 'react';

import { useHistory, useParams } from 'react-router';

import { useSelector } from 'react-redux';

import { Button, CircularProgress, Typography, styled } from '@mui/material';
import { circularProgressClasses } from '@mui/material/CircularProgress';

import { searchSuggestData } from '../assets';
import { kebab } from '../utils';

const Wrapper = styled('section')({
	display: 'flex',
	justifyContent: 'center',
	flexWrap: 'wrap',
	maxWidth: 1000,
	alignSelf: 'center',
});

const Headings = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'center',
	margin: theme.spacing(7, 0, 3),
}));

const SuggestionButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(1),
	padding: theme.spacing(1, 3),
	fontSize: theme.typography.h4.fontSize,
	borderRadius: theme.spacing(3),
	borderColor: '#bdbdbd',
	'&.Mui-disabled, :active': {
		backgroundColor: theme.palette.grey[300],
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
	const { term: urlTerm } = useParams();
	const [loading, setLoading] = useState(false);
	const searchData = useSelector((state) => state.searchData);

	function handleClick(term) {
		if (kebab(term) === urlTerm) return setLoading(false);
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
						disabled={loading === term[0]}
						startIcon={
							loading === term[0] ? (
								<CircularProgress
									size={25}
									thickness={7.2}
									color="action"
									sx={{
										[`& .${circularProgressClasses.circle}`]: {
											strokeLinecap: 'round',
										},
									}}
								/>
							) : (
								term[1]
							)
						}
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
