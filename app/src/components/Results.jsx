import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { useReactiveVar, useLazyQuery, gql } from '@apollo/client';

import { styled } from '@material-ui/core';

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

export default function Results() {
	const searchResults = useReactiveVar(searchResultsVar);
	const { term } = useParams();

	const [search, { called }] = useLazyQuery(SEARCH_RECIPES, {
		displayName: 'search-from-url',
		onCompleted: (data) => {
			searchResultsVar(data);
		},
		onError: (error) => console.error('While getting recipes:', error.message),
	});

	useEffect(() => {
		if (called) return;

		search({ variables: { term } });
	}, [term, called, search]);

	if (searchResults)
		return (
			<Grid>
				{searchResults?.search?.map((recipe) => (
					<ResultCard key={recipe._id} recipe={recipe} />
				))}
			</Grid>
		);

	return null;
}
