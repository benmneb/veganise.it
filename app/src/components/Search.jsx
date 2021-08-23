import { useEffect, useRef, useMemo, useState } from 'react';

import { useLazyQuery, gql } from '@apollo/client';

import { styled, FormControl, OutlinedInput } from '@material-ui/core/';
import { useFormControl } from '@material-ui/core/FormControl';
import { LoadingButton } from '@material-ui/lab';

import Typed from 'typed.js';

import { HideOnScroll } from '../utils';
import { searchResultsVar } from '../cache';

const FormController = styled(FormControl)(({ theme }) => ({
	position: 'sticky',
	top: theme.spacing(4),
	zIndex: theme.zIndex.appBar,
	backgroundColor: 'transparent',
	borderRadius: theme.shape.borderRadius,
	display: 'flex',
	flexDirection: 'row',
	[theme.breakpoints.down('tablet')]: {
		flexDirection: 'column',
	},
	justifyContent: 'center',
	alignItems: 'center',
	margin: theme.spacing(-10, 4, 4),
}));

const TextField = styled(OutlinedInput)(({ theme }) => ({
	width: 458,
	height: 80,
	backgroundColor: theme.palette.background.paper,
	fontSize: theme.typography.h3.fontSize,
	fontWeight: theme.typography.h3.fontWeight,
	borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
	[theme.breakpoints.down('tablet')]: {
		width: '100%',
		fontSize: theme.typography.h4.fontSize,
		borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
	},
	'& .MuiOutlinedInput-input': {
		textAlign: 'center',
	},
}));

const TextBox = styled('div')(({ theme }) => ({
	[theme.breakpoints.down('tablet')]: {
		width: '100%',
		maxWidth: 458,
		display: 'flex',
		justifyContent: 'center',
	},
}));

const SearchBox = styled(TextBox)({
	flexShrink: 0,
});

const SearchButton = styled(LoadingButton)(({ theme }) => ({
	height: 80,
	fontSize: theme.typography.h3.fontSize,
	fontWeight: theme.typography.h3.fontWeight,
	borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
	[theme.breakpoints.down('tablet')]: {
		fontSize: theme.typography.h4.fontSize,
		borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
		width: '100%',
	},
	'&.Mui-focusVisible': {
		border: `2px solid ${theme.palette.action.focus}`,
	},
	'&:active': {
		backgroundColor: theme.palette.action.active,
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

function TypedInputs() {
	const { focused } = useFormControl() || {};
	const [inputValue, setInputValue] = useState('');
	const [search, { loading }] = useLazyQuery(SEARCH_RECIPES, {
		displayName: 'search',
		onCompleted: (data) => {
			searchResultsVar(data);
			console.log(data);
		},
		onError: (error) => console.error(error.message),
	});

	const inputRef = useRef(null);
	const stringRef = useRef(null);
	const typedRef = useRef(null);

	// initialise Typed.js on load, and destroy it on unmount
	useEffect(() => {
		const options = {
			strings: [
				'Delicious food',
				'Something else great',
				'So many awesome things',
				'Its truly amazing',
				'Absolutely fabulous',
				'Outstandingly entertaining',
			],
			typeSpeed: 80,
			backSpeed: 30,
			startDelay: 300,
			backDelay: 1500,
			smartBackspace: false,
			loop: true,
			shuffle: true,
			preStringTyped: (arrayPos, self) =>
				(stringRef.current = self.strings[self.sequence[arrayPos]]),
		};

		typedRef.current = new Typed(inputRef.current, options);

		return () => {
			typedRef.current.destroy();
		};
	}, []);

	const placeholder = useMemo(() => {
		if (focused) {
			typedRef.current.destroy();
			stringRef.current = null;
			return 'Your favourite meal...';
		}

		if (inputValue) return;

		typedRef.current?.reset();
		return undefined;
	}, [focused, inputValue]);

	function handleSearch() {
		const term = inputValue || stringRef.current;

		if (!term) return;

		search({ variables: { term } });
	}

	function handleKeyPress(e) {
		if (e.key !== 'Enter') return;

		e.preventDefault();
		handleSearch();
	}

	function handleBlur() {
		if (inputValue) return;

		searchResultsVar([]);
	}

	return (
		<>
			<TextBox>
				<TextField
					placeholder={placeholder}
					inputRef={inputRef}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyPress={handleKeyPress}
					onBlur={handleBlur}
				/>
			</TextBox>
			<SearchBox>
				<SearchButton
					disableElevation
					variant="contained"
					onClick={handleSearch}
					loading={loading}
					loadingIndicator="Preparing..."
				>
					Veganise It!
				</SearchButton>
			</SearchBox>
		</>
	);
}

export default function Search() {
	return (
		<HideOnScroll threshold={(55 / 100) * window.innerHeight}>
			<FormController component="form">
				<TypedInputs />
			</FormController>
		</HideOnScroll>
	);
}
