import { useState } from 'react';

import { useHistory, useLocation } from 'react-router';

import { gql, useLazyQuery } from '@apollo/client';

import { styled, alpha } from '@mui/material/styles';
import { InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';

import { searchResultsVar } from '../cache';

const SearchBox = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.black, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.black, 0.25),
	},
	marginLeft: 0,
	'& .MuiInputBase-root': {
		width: '100%',
	},
	width: '100%',
	[theme.breakpoints.up('tablet')]: {
		marginLeft: theme.spacing(1),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('tablet')]: {
			width: '24ch',
			'&:focus': {
				width: '27ch',
			},
		},
	},
}));

const SEARCH_RECIPES = gql`
	query Search($term: String!) {
		search(term: $term) {
			_id
			title
			author
			likes
		}
	}
`;

export default function AppbarSearch() {
	const history = useHistory();
	const location = useLocation();
	const [term, setTerm] = useState('');

	const [search] = useLazyQuery(SEARCH_RECIPES, {
		displayName: 'search',
		onCompleted: (data) => {
			searchResultsVar(data);
			const urlTerm = term.replace(/\s+/g, '-').toLowerCase();
			history.push(`/${urlTerm}`);
		},
		onError: (error) => console.error(error.message),
	});

	function handleKeyPress(e) {
		if (e.key !== 'Enter') return;
		if (!term) return;
		if (term === 'submit' || term === 'advertise') {
			return history.push({
				pathname: `/${term}`,
				state: { background: location },
			});
		}
		search({ variables: { term } });
	}

	return (
		<SearchBox>
			<SearchIconWrapper>
				<Search />
			</SearchIconWrapper>
			<StyledInputBase
				placeholder="Search 5000+ vegan recipes..."
				inputProps={{ 'aria-label': 'search' }}
				value={term}
				onChange={(e) => setTerm(e.target.value)}
				onKeyPress={handleKeyPress}
			/>
		</SearchBox>
	);
}
