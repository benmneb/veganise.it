import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { Snackbar, Alert } from '@mui/material';

import { sliceSnackPack } from '../state';

export default function Snackbars() {
	const dispatch = useDispatch();
	const snackPack = useSelector((state) => state.snackPack);
	const [open, setOpen] = useState(false);
	const [messageInfo, setMessageInfo] = useState(undefined);

	useEffect(() => {
		if (snackPack.length && !messageInfo) {
			// Set a new snack when we don't have an active one
			setMessageInfo({ ...snackPack[0] });
			dispatch(sliceSnackPack());
			setOpen(true);
		} else if (snackPack.length && messageInfo && open) {
			// Close an active snack when a new one is added
			setOpen(false);
		}
	}, [snackPack, messageInfo, open, dispatch]);

	function handleClose(_, reason) {
		if (reason !== 'clickaway') {
			setOpen(false);
		}
	}

	function handleExited() {
		setMessageInfo(null);
	}

	return (
		<Snackbar
			className="mui-fixed"
			key={messageInfo ? messageInfo.key : null}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			open={open}
			autoHideDuration={6000}
			onClose={handleClose}
			TransitionProps={{ onExited: handleExited }}
		>
			<Alert
				onClose={handleClose}
				severity={messageInfo?.severity || 'success'}
				variant="filled"
				elevation={6}
				sx={{
					width: { mobile: '100%', tablet: 'auto' },
					fontSize: 'h6.fontSize',
					display: 'flex',
					alignItems: 'center',
					'& .MuiAlert-action': {
						padding: (theme) => theme.spacing(0, 1),
					},
				}}
			>
				{messageInfo ? messageInfo.message : null}
			</Alert>
		</Snackbar>
	);
}
