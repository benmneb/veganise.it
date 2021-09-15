import { useEffect, useRef, useMemo, useState } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { styled, FormControl, OutlinedInput } from '@mui/material/';
import { useFormControl } from '@mui/material/FormControl';
import { LoadingButton } from '@mui/lab';

import Typed from 'typed.js';

import { HideOnScroll } from '../utils';
import { search, setSearchResults } from '../state';
import { autosuggestStrings } from '../assets';

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
	margin: theme.spacing(-10, -3, 4),
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

function TypedInputs() {
	const { focused } = useFormControl() || {};
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();

	const searchResults = useSelector((state) => state.searchResults);
	const [inputValue, setInputValue] = useState('');

	const inputRef = useRef(null);
	const stringRef = useRef(null);
	const typedRef = useRef(null);

	// initialise Typed.js on load, and destroy it on unmount
	useEffect(() => {
		const options = {
			strings: autosuggestStrings,
			typeSpeed: 130,
			backSpeed: 50,
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
		return null;
	}, [focused, inputValue]);

	async function handleSearch() {
		const term = inputValue || stringRef.current;

		if (!term) return;

		if (term === 'submit' || term === 'advertise') {
			return history.push({
				pathname: `/${term}`,
				state: { background: location },
			});
		}

		if (!inputValue) {
			typedRef.current.destroy();
			setInputValue(term);
		}

		dispatch(search(term));
	}

	function handleKeyPress(e) {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		handleSearch();
	}

	function handleBlur() {
		if (inputValue) return;
		if (history.location.pathname !== '/' && !searchResults?.data.length) {
			dispatch(setSearchResults(null));
			history.push('/');
		}
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
					// loading={loading}
					loadingIndicator="Veganising..."
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
