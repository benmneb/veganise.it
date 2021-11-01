import { useEffect, useRef } from 'react';

import { Helmet } from 'react-helmet';

import { useParams, useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { styled, Fab, useMediaQuery } from '@mui/material';
import { KeyboardArrowUpRounded } from '@mui/icons-material';

import InfiniteScrollComponent from 'react-infinite-scroll-component';

import { ResultCard, ResultsSpinner, SubmitCard, Suggestions } from './index';
import {
	api,
	spaceout,
	scrollToResults,
	titlise,
	ScrollTrigger,
} from '../utils';
import {
	setLoadingSearch,
	setSearchData,
	updateSearchResultsOnScroll,
	showSnackbar,
} from '../state';

const InfiniteScroll = styled(InfiniteScrollComponent)(({ theme }) => ({
	width: '100%',
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(315px, 1fr))',
	gridGap: theme.spacing(6),
	[theme.breakpoints.only('mobile')]: {
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
	},
}));

const BackToTop = styled(Fab)(({ theme }) => ({
	position: 'fixed',
	bottom: theme.spacing(2),
	right: theme.spacing(2),
}));

const DEFAULT_OFFSET = 20;

export default function Results() {
	const dispatch = useDispatch();
	const history = useHistory();
	const searchData = useSelector((state) => state.searchData);
	const { term: rawTerm } = useParams();
	const mobile = useMediaQuery((theme) => theme.breakpoints.only('mobile'));
	const offset = useRef(DEFAULT_OFFSET);

	const term = spaceout(rawTerm);

	// Perform search based on url params.
	// This is the initial search no matter the source (main search bar, url, or appbar).
	useEffect(() => {
		(async () => {
			// Reset offset for future `loadMoreOnScroll()` calls.
			offset.current = DEFAULT_OFFSET;

			try {
				const response = await api.get(`/search/${term}`);
				dispatch(setSearchData({ term, ...response.data }));
				dispatch(setLoadingSearch(false));
				scrollToResults();
			} catch (error) {
				console.error('While searching:', error);
				dispatch(setLoadingSearch(false));
				history.replace('/');
				dispatch(
					showSnackbar({
						message: 'Could not search! Try again soon.',
						severity: 'error',
					})
				);
			}
		})();
	}, [term, dispatch, history]);

	// Set searchData to null on unmount.
	useEffect(() => {
		return () => dispatch(setSearchData(null));
	}, [dispatch]);

	async function loadMoreOnScroll() {
		try {
			const response = await api.get(`/search-more/${term}/${offset.current}`);
			offset.current += DEFAULT_OFFSET;
			dispatch(updateSearchResultsOnScroll(response.data.results));
		} catch (error) {
			console.error('While trying to scroll infinitely:', error);
			dispatch(
				showSnackbar({
					message: "Couldn't load more recipes! Try again soon.",
					severity: 'error',
				})
			);
		}
	}

	function scrollToTop() {
		return window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
	}

	return (
		<div style={{ width: '100%' }}>
			<Helmet>
				<title>
					{`Vegan ${searchData?.term ? titlise(searchData.term) : ''} Recipes @
					Veganise It!`}
				</title>
				<meta
					name="description"
					content={`The internet's most mouth-watering vegan ${
						searchData?.term ? titlise(searchData.term) : ''
					} recipes only at Veganise.It`}
				/>
			</Helmet>
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
			{searchData?.results.length === searchData?.totalCount && <Suggestions />}
			{!window.location.href.includes('/recipe/') && (
				<ScrollTrigger
					onScroll="show"
					disableHysteresis
					transition="zoom"
					threshold={window.innerHeight}
				>
					<BackToTop
						color="secondary"
						aria-label="scroll back to top"
						size={mobile ? 'medium' : 'large'}
						onClick={scrollToTop}
					>
						<KeyboardArrowUpRounded fontSize="large" />
					</BackToTop>
				</ScrollTrigger>
			)}
		</div>
	);
}
