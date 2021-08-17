import { useEffect, useRef, useMemo } from 'react';
import {
	Button,
	styled,
	FormControl,
	OutlinedInput,
	useScrollTrigger,
	Grow,
} from '@material-ui/core/';
import { useFormControl } from '@material-ui/core/FormControl';

import Typed from 'typed.js';

const FormController = styled(FormControl)(({ theme }) => ({
	position: 'sticky',
	top: theme.spacing(4),
	zIndex: theme.zIndex.appBar,
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	display: 'flex',
	flexDirection: 'row',
	[theme.breakpoints.down('tablet')]: {
		flexDirection: 'column',
	},
	justifyContent: 'center',
	alignItems: 'center',
	margin: theme.spacing(0, 4, 4),
}));

const TextField = styled(OutlinedInput)(({ theme }) => ({
	height: 80,
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

const Box = styled('div')(({ theme }) => ({
	[theme.breakpoints.down('tablet')]: {
		width: '100%',
		maxWidth: 458,
		display: 'flex',
		justifyContent: 'center',
	},
}));

const SearchButton = styled(Button)(({ theme }) => ({
	height: 80,
	fontSize: theme.typography.h3.fontSize,
	fontWeight: theme.typography.h3.fontWeight,
	borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
	[theme.breakpoints.down('tablet')]: {
		fontSize: theme.typography.h4.fontSize,
		borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
		width: '100%',
	},
}));

function HideOnScroll(props) {
	const { children } = props;

	const trigger = useScrollTrigger({ threshold: '520' });

	return (
		<Grow appear={false} direction="down" in={!trigger}>
			{children}
		</Grow>
	);
}

function TypedInputs() {
	const { focused } = useFormControl() || {};

	const inputRef = useRef(null);
	const stringRef = useRef(null);
	const typedRef = useRef(null);

	// initialise Typed.js on load
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
			return 'Your favourite meal...';
		}

		typedRef.current?.reset();
		return undefined;
	}, [focused]);

	function handleSearch() {
		console.log(stringRef.current);
	}

	return (
		<>
			<Box>
				<TextField placeholder={placeholder} inputRef={inputRef} />
			</Box>
			<Box>
				<SearchButton
					disableElevation
					variant="contained"
					onClick={handleSearch}
				>
					Veganise It!
				</SearchButton>
			</Box>
		</>
	);
}

export default function Search() {
	return (
		<HideOnScroll>
			<FormController component="form">
				<TypedInputs />
			</FormController>
		</HideOnScroll>
	);
}
