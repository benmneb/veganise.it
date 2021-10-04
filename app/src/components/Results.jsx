import { useEffect, useRef } from 'react';

import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { styled } from '@mui/material';

import InfiniteScrollComponent from 'react-infinite-scroll-component';

import { ResultCard, ResultsSpinner, SubmitCard } from './index';
import { api, spaceout, scrollToResults } from '../utils';
import {
	setLoadingSearch,
	setSearchData,
	updateSearchResultsOnScroll,
	showSnackbar,
} from '../state';

const InfiniteScroll = styled(InfiniteScrollComponent)(({ theme }) => ({
	width: '100%',
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
	gridGap: theme.spacing(6),
	[theme.breakpoints.only('mobile')]: {
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
	},
}));

const DEFAULT_OFFSET = 20;

export default function Results() {
	const dispatch = useDispatch();
	const searchData = useSelector((state) => state.searchData);
	const { term: rawTerm } = useParams();
	const offset = useRef(DEFAULT_OFFSET);

	const term = spaceout(rawTerm);

	// perform search based on url params
	// this is the initial search no matter the source (main search bar, url, or appbar)
	useEffect(() => {
		(async () => {
			// reset offset for future `loadMoreOnScroll()` calls
			offset.current = DEFAULT_OFFSET;

			try {
				const response = await api.get(`/search/${term}`);
				dispatch(setSearchData({ term, ...response.data }));
				dispatch(setLoadingSearch(false));
				scrollToResults();
			} catch (error) {
				console.error('While searching:', error);
				dispatch(setLoadingSearch(false));
				dispatch(
					showSnackbar({
						message: 'Could not search! Try again soon.',
						severity: 'error',
					})
				);
			}
		})();
	}, [term, dispatch]);

	// set searchData to null on unmount
	useEffect(() => {
		return () => dispatch(setSearchData(null));
	}, [dispatch]);

	async function loadMoreOnScroll() {
		try {
			const response = await api.get(`/search-more/${term}/${offset.current}`);
			offset.current += DEFAULT_OFFSET;
			dispatch(updateSearchResultsOnScroll(response.data.results));
		} catch (error) {
			console.error('While trying to scoll infinitely:', error);
			dispatch(
				showSnackbar({
					message: 'Could not load more! Try again soon.',
					severity: 'error',
				})
			);
		}
	}

	return (
		<div style={{ width: '100%' }}>
			<InfiniteScroll
				style={{ overflow: 'unset' }}
				dataLength={searchData?.results.length || 0}
				next={loadMoreOnScroll}
				hasMore={searchData?.results.length < searchData?.totalCount}
				loader={null}
				endMessage={
					searchData?.results.length > 0 &&
					searchData?.results.length === searchData?.totalCount && (
						<SubmitCard />
					)
				}
			>
				{searchData?.results.map((recipe) => (
					<ResultCard key={recipe._id} recipe={recipe} />
				))}
			</InfiniteScroll>
			<ResultsSpinner
				show={searchData?.results.length < searchData?.totalCount}
			/>
		</div>
	);
}
