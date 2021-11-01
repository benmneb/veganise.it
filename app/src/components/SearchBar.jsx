import { useEffect, useState } from 'react';

import { styled, OutlinedInput } from '@mui/material';

const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
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

// This component exists solely to fix the react controlled input bug
// where the cursor keeps jumping to the end when your try and type in the middle.
// Jacked w/ ❤️ from this answer https://stackoverflow.com/a/68928267/12104850

export default function ControlledInput(props) {
	const { value, onChange, inputRef, ...rest } = props;

	const [cursor, setCursor] = useState(null);

	useEffect(() => {
		const input = inputRef.current;
		if (input) input.setSelectionRange(cursor, cursor);
	}, [inputRef, cursor, value]);

	function handleChange(e) {
		setCursor(e.target.selectionStart);
		if (onChange) onChange(e);
	}

	return (
		<StyledOutlinedInput
			inputRef={inputRef}
			value={value}
			onChange={handleChange}
			spellCheck="false"
			autoCapitalize="off"
			autoCorrect="off"
			enterkeyhint="search"
			{...rest}
		/>
	);
}
