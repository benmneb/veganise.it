import { useEffect, useRef, useMemo } from 'react';
import { Button, styled, FormControl, OutlinedInput } from '@material-ui/core/';
import { useFormControl } from '@material-ui/core/FormControl';

import Typed from 'typed.js';

const Form = styled(FormControl)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	margin: theme.spacing(0, 4, 4),
}));

const TextField = styled(OutlinedInput)(({ theme }) => ({
	fontSize: theme.typography.h3.fontSize,
	fontWeight: theme.typography.h3.fontWeight,
	borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
	height: 80,
	'& .MuiOutlinedInput-input': {
		textAlign: 'center',
	},
}));

const SearchButton = styled(Button)(({ theme }) => ({
	fontSize: theme.typography.h3.fontSize,
	fontWeight: theme.typography.h3.fontWeight,
	borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
	height: 80,
}));

function TypedInputs() {
	const { focused } = useFormControl() || {};

	const input = useRef(null);
	const string = useRef(null);
	const typed = useRef(null);

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
				(string.current = self.strings[self.sequence[arrayPos]]),
		};

		typed.current = new Typed(input.current, options);

		return () => {
			typed.current.destroy();
		};
	}, []);

	const placeholder = useMemo(() => {
		if (focused) {
			typed.current.destroy();
			return 'Your favourite meal...';
		}

		typed.current?.reset();
		return undefined;
	}, [focused]);

	function handleSearch() {
		console.log(string.current);
	}

	return (
		<>
			<div>
				<TextField placeholder={placeholder} inputRef={input} />
			</div>
			<div>
				<SearchButton
					disableElevation
					variant="contained"
					onClick={handleSearch}
				>
					Veganise It!
				</SearchButton>
			</div>
		</>
	);
}

export default function Search() {
	return (
		<Form component="form">
			<TypedInputs />
		</Form>
	);
}
