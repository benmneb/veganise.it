import { useEffect, useRef, useMemo, useState } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import {
	styled,
	FormControl,
	IconButton,
	FormGroup,
	useMediaQuery,
} from '@mui/material/';
import { useFormControl } from '@mui/material/FormControl';
import { ClearRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import Typed from 'typed.js';

import { SearchBar } from './index';
import { ScrollTrigger, kebab, clean } from '../utils';
import { setLoadingSearch, setSearchData } from '../state';
import { searchSuggestStrings } from '../assets';

const FormController = styled(FormControl)(({ theme }) => ({
	position: 'sticky',
	top: theme.spacing(4),
	zIndex: theme.zIndex.appBar,
	backgroundColor: 'transparent',
	borderRadius: theme.shape.borderRadius,
	margin: theme.spacing(-10, -3, 4),
}));

const ClearSearch = styled('div')({
	position: 'absolute',
	right: 0,
	backgroundColor: 'inherit',
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
	'&.Mui-disabled, :active': {
		backgroundColor: theme.palette.grey[400],
	},
}));

function TypedInputs(props) {
	const { setInputFocus } = props;

	const { focused } = useFormControl() || {};
	const mobile = useMediaQuery((theme) => theme.breakpoints.only('mobile'));

	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();

	const searchData = useSelector((state) => state.searchData);
	const loading = useSelector((state) => state.loadingSearch);

	const [inputValue, setInputValue] = useState('');

	const inputRef = useRef(null);
	const stringRef = useRef(null);
	const typedRef = useRef(null);

	// initialise Typed.js on load, and destroy it on unmount
	useEffect(() => {
		const options = {
			strings: searchSuggestStrings,
			typeSpeed: 130,
			backSpeed: 50,
			startDelay: 300,
			backDelay: 1500,
			smartBackspace: false,
			loop: true,
			shuffle: true,
			showCursor: false,
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

	function handleSearch() {
		const term = inputValue.trim() || stringRef.current;

		// dont perform empty search || dont perform same search twice
		if (!term || clean(term) === searchData?.term) return;

		setInputFocus(false);

		if (term === 'submit' || term === 'advertise') {
			return history.push({
				pathname: `/${term}`,
				state: { background: location },
			});
		}

		// Blur input if on Safari macOS because Safari is the new IE.
		if (window.safari) {
			setTimeout(() => {
				document.activeElement.blur();
			}, 0);
		}

		dispatch(setLoadingSearch(true));

		if (!inputValue) {
			typedRef.current.destroy();
			setInputValue(term);
		}

		history.push(`/${kebab(term)}`);
	}

	function handleKeyDown(e) {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		handleSearch();
	}

	function handleBlur() {
		setInputFocus(false);
		if (inputValue) return;
		if (history.location.pathname !== '/' && !searchData?.results.length) {
			dispatch(setSearchData(null));
			history.push('/');
		}
	}

	function handleClear() {
		setInputValue('');

		// Blur input if on Safari macOS because Safari is the new IE.
		if (window.safari) {
			setTimeout(() => {
				document.activeElement.blur();
			}, 0);
		}
	}

	const endAdornment = (
		<ClearSearch>
			<IconButton onClick={handleClear} size="large">
				<ClearRounded color="action" fontSize="large" />
			</IconButton>
		</ClearSearch>
	);

	return (
		<FormGroup row={!mobile}>
			<SearchBar
				placeholder={placeholder}
				inputRef={inputRef}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				onFocus={() => setInputFocus(true)}
				endAdornment={inputValue && endAdornment}
			/>
			<SearchButton
				disableElevation
				variant="contained"
				onClick={handleSearch}
				loading={loading}
				loadingIndicator="Veganising..."
			>
				Veganise It!
			</SearchButton>
		</FormGroup>
	);
}

export default function Search() {
	const [inputFocus, setInputFocus] = useState(false);

	return (
		<ScrollTrigger
			threshold={(55 / 100) * window.innerHeight}
			disabled={inputFocus}
		>
			<FormController component="form">
				<TypedInputs setInputFocus={setInputFocus} />
			</FormController>
		</ScrollTrigger>
	);
}
