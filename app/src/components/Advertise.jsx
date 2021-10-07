import { useState } from 'react';

import { Helmet } from 'react-helmet';

import { useHistory, useLocation } from 'react-router-dom';

import { useDispatch } from 'react-redux';

import { styled, Button, OutlinedInput, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Appbar } from './index';
import { api } from '../utils';
import { showSnackbar } from '../state';

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
	width: 180,
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

export default function Advertise(props) {
	const { close } = props;

	const location = useLocation();
	const history = useHistory();
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [isError, setIsError] = useState(false);
	const [loading, setLoading] = useState(false);

	const background = location.state?.background;

	async function handleSubmit() {
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return setIsError(true);
		}

		setLoading(true);

		try {
			await api.post('/advertise', { email });
			dispatch(showSnackbar({ message: 'Email sent. Thanks!' }));
			if (background) close();
			if (!background) setLoading(false);
		} catch (error) {
			dispatch(
				showSnackbar({
					message: 'Something went wrong. Try again later!',
					severity: 'error',
				})
			);
			setLoading(false);
			console.error('Error sending advertising request:', error.message);
		}
	}

	function handleChange(e) {
		setIsError(false);
		setEmail(e.target.value);
	}

	function handleKeyDown(e) {
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
			<Helmet>
				<title>Advertise @ Veganise It!</title>
				<meta name="description" content="Promote your brand on Veganise It!" />
			</Helmet>
			{!background && <Appbar />}
			<Root>
				<Content>
					<Typography variant="h2" component="h1">
						Advertise on Veganise.it
					</Typography>
					<Form>
						<TextBox>
							<TextField
								placeholder="Your email..."
								type="text"
								error={isError}
								value={email}
								onChange={handleChange}
								onKeyDown={handleKeyDown}
								disabled={loading}
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
								Send It!
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
