import { useState } from 'react';

import { Helmet } from 'react-helmet';

import { useDispatch } from 'react-redux';

import {
	styled,
	Autocomplete,
	Button,
	Dialog,
	TextField,
	Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

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

const SubmitButton = styled(LoadingButton)(({ theme }) => ({
	fontSize: theme.typography.h5.fontSize,
}));

const CancelButton = styled(Button)(({ theme }) => ({
	fontSize: theme.typography.h5.fontSize,
}));

const options = [
	'The image is wrong',
	'The recipe is a duplicate',
	'The details are wrong',
	'The source link is broken',
];

export default function Report(props) {
	const { open, close, recipe } = props;

	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState(null);
	const [reason, setReason] = useState('');
	const [reasonError, setReasonError] = useState(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit() {
		if (!reason || reason.length < 10) {
			return setReasonError(true);
		}
		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return setEmailError(true);
		}

		setLoading(true);

		try {
			await api.post('/report', { reason, email, recipe });
			dispatch(
				showSnackbar({ message: 'Recipe flagged for moderation. Thanks!' })
			);
			setLoading(false);
			close();
		} catch (error) {
			dispatch(
				showSnackbar({
					message: 'Something went wrong. Try again later!',
					severity: 'error',
				})
			);
			setLoading(false);
			console.error('Error reporting recipe:', error.message);
		}
	}

	function handleChangeReason(_, inputValue) {
		setReasonError(false);
		setReason(inputValue);
	}

	function handleChangeEmail(e) {
		setEmailError(false);
		setEmail(e.target.value);
	}

	return (
		<>
			{open && (
				<Helmet>
					<title>Report Recipe @ Veganise.it</title>
				</Helmet>
			)}
			<Dialog open={open} onClose={close}>
				<Root>
					<Content>
						<Typography variant="h3" component="h1">
							Report Recipe 😵
						</Typography>
						<Autocomplete
							sx={{ mb: 2 }}
							freeSolo
							fullWidth
							inputValue={reason}
							onInputChange={handleChangeReason}
							options={options.map((option) => option)}
							renderInput={(params) => (
								<TextField
									{...params}
									inputProps={{
										...params.inputProps,
										sx: { fontSize: 'h5.fontSize' },
									}}
									placeholder="Reason for reporting..."
									error={reasonError}
								/>
							)}
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
							loading={loading}
							onClick={handleSubmit}
							disableElevation
							sx={{ fontWeight: 'fontWeightBold' }}
						>
							Submit Report
						</SubmitButton>
						<CancelButton onClick={close} color="inherit" size="large">
							🙅 Cancel
						</CancelButton>
					</Content>
				</Root>
			</Dialog>
		</>
	);
}
