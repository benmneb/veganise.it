import { useState } from 'react';

import { Helmet } from 'react-helmet';

import { useDispatch } from 'react-redux';

import { Button, Dialog, TextField, Typography, styled } from '@mui/material';

import { showSnackbar } from '../state';
import { api } from '../utils';

const Root = styled('section')(({ theme }) => ({
	height: '100%',
	maxWidth: theme.breakpoints.values.tablet,
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
		marginBottom: theme.spacing(1),
	},
	'& p': {
		textAlign: 'center',
		marginBottom: theme.spacing(4),
	},
	'& .MuiFormControl-root:first-of-type': {
		marginBottom: theme.spacing(1),
	},
	'& > button': {
		marginTop: theme.spacing(3),
		maxWidth: 200,
		width: '100%',
	},
	'& > button:last-of-type': {
		marginTop: theme.spacing(1),
	},
}));

const SubmitButton = styled(Button)(({ theme }) => ({
	fontSize: theme.typography.h5.fontSize,
	'&.Mui-disabled, :active': {
		backgroundColor: theme.palette.grey[300],
	},
}));

const CancelButton = styled(Button)(({ theme }) => ({
	fontSize: theme.typography.h5.fontSize,
}));

export default function ContactModal(props) {
	const { open, close } = props;

	const dispatch = useDispatch();
	const [message, setMessage] = useState('');
	const [messageError, setMessageError] = useState(null);
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState(null);
	const [loading, setLoading] = useState(false);

	function handleClose() {
		setEmail('');
		setEmailError(null);
		setMessage('');
		setMessageError(null);
		setLoading(false);
		close();
	}

	async function handleSubmit() {
		if (!message || message.length < 10) {
			return setMessageError(true);
		}
		if (!email || !/^([^\s@]+)@([^\s@]+).([^\s@.]{2,})$/.test(email)) {
			return setEmailError(true);
		}

		setLoading(true);

		try {
			await api.post('/contact', { message, email });
			dispatch(showSnackbar({ message: 'Sent! Thanks' }));
			setLoading(false);
			handleClose();
		} catch (error) {
			dispatch(
				showSnackbar({
					message: 'Something went wrong. Try again later!',
					severity: 'error',
				})
			);
			setLoading(false);
			console.error('Error submitting contact form:', error.message);
		}
	}

	function handleChangeMessage(e) {
		setMessageError(false);
		setMessage(e.target.value);
	}

	function handleChangeEmail(e) {
		setEmailError(false);
		setEmail(e.target.value);
	}

	return (
		<>
			{open && (
				<Helmet>
					<title>Contact @ Veganise.it</title>
				</Helmet>
			)}
			<Dialog open={open} onClose={handleClose} scroll="body">
				<Root>
					<Content>
						<Typography variant="h3" component="h1">
							Contact 💌
						</Typography>
						<Typography variant="h5" component="p">
							For questions, comments, concerns, criticisms, complaints and
							outrageous compliments.
						</Typography>

						<TextField
							fullWidth
							multiline
							rows={5}
							inputProps={{ sx: { fontSize: 'h5.fontSize' } }}
							variant="outlined"
							placeholder="Message"
							value={message}
							onChange={handleChangeMessage}
							error={messageError}
						/>
						<TextField
							fullWidth
							inputProps={{ sx: { fontSize: 'h5.fontSize' } }}
							variant="outlined"
							placeholder="Your email"
							value={email}
							onChange={handleChangeEmail}
							error={emailError}
						/>
						<SubmitButton
							variant="contained"
							size="large"
							disabled={loading}
							onClick={handleSubmit}
							disableElevation
							sx={{ fontWeight: 'fontWeightBold' }}
						>
							{loading ? 'Sending...' : 'Send 📨'}
						</SubmitButton>
						<CancelButton onClick={handleClose} color="inherit" size="large">
							🙅 Cancel
						</CancelButton>
					</Content>
				</Root>
			</Dialog>
		</>
	);
}
