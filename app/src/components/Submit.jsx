import { useState } from 'react';

import { useMutation, gql } from '@apollo/client';

import { useHistory, useLocation } from 'react-router-dom';

import { styled, Button, OutlinedInput, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Appbar } from './index';
import { snackPackVar } from '../cache';

const Root = styled('section')(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	padding: theme.spacing(4),
	cursor: 'auto',
}));

const Content = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	'& h1': {
		textAlign: 'center',
		marginBottom: theme.spacing(5),
	},
	'& > button': {
		marginTop: theme.spacing(3),
		maxWidth: 200,
		width: '100%',
	},
}));

const Form = styled('form')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	[theme.breakpoints.down('tablet')]: {
		flexDirection: 'column',
	},
	justifyContent: 'center',
	alignItems: 'center',
	width: '100%',
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

const CancelButton = styled(Button)(({ theme }) => ({
	fontSize: theme.typography.h5.fontSize,
}));

const SUBMIT_RECIPES = gql`
	mutation Submit($url: String!) {
		submit(url: $url) {
			success
			errorMessage
		}
	}
`;

export default function Submit(props) {
	const { close } = props;

	const [input, setInput] = useState('');
	const [isError, setIsError] = useState(false);
	const location = useLocation();
	const history = useHistory();

	const background = location.state?.background;

	const [submit, { loading }] = useMutation(SUBMIT_RECIPES, {
		fetchPolicy: 'no-cache',
		onCompleted: ({ submit }) => {
			if (!submit.success) {
				snackPackVar([
					...snackPackVar(),
					{
						message: 'Something went wrong. Try again soon!',
						severity: 'error',
						key: new Date().getTime(),
					},
				]);
				return console.error('Error sending email:', submit.errorMessage);
			}
			snackPackVar([
				...snackPackVar(),
				{
					message: 'Email sent. Thanks!',
					key: new Date().getTime(),
				},
			]);
			close();
			return console.log('Email sent:', submit.success);
		},
		onError: (error) => console.error('Error submitting:', error),
	});

	function handleSubmit() {
		if (!input || input.length < 6) return setIsError(true);
		submit({ variables: { url: input } });
	}

	function handleChange(e) {
		setIsError(false);
		setInput(e.target.value);
	}

	function handleKeyPress(e) {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		handleSubmit();
	}

	function handleCancel() {
		if (background) return close();
		history.push('/');
	}

	return (
		<>
			{!background && <Appbar />}
			<Root>
				<Content>
					<Typography variant="h2" component="h1">
						Submit Vegan Recipes
					</Typography>
					<Form>
						<TextBox>
							<TextField
								placeholder="Your website..."
								type="text"
								error={isError}
								value={input}
								onChange={handleChange}
								onKeyPress={handleKeyPress}
							/>
						</TextBox>
						<SearchBox>
							<SearchButton
								disableElevation
								variant="contained"
								onClick={handleSubmit}
								loading={loading}
								loadingIndicator="Sending..."
							>
								Submit It!
							</SearchButton>
						</SearchBox>
					</Form>
					<CancelButton onClick={handleCancel} color="inherit" size="large">
						🙅 Cancel
					</CancelButton>
				</Content>
			</Root>
		</>
	);
}
