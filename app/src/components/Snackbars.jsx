import { useState, useEffect } from 'react';

import { useReactiveVar } from '@apollo/client';

import { Snackbar, Alert } from '@mui/material';

import { snackPackVar } from '../cache';

export default function Snackbars() {
	const snackPack = useReactiveVar(snackPackVar);
	const [open, setOpen] = useState(false);
	const [messageInfo, setMessageInfo] = useState(undefined);

	useEffect(() => {
		if (snackPack.length && !messageInfo) {
			// Set a new snack when we don't have an active one
			setMessageInfo({ ...snackPack[0] });
			snackPackVar([...snackPack.slice(1)]);
			setOpen(true);
		} else if (snackPack.length && messageInfo && open) {
			// Close an active snack when a new one is added
			setOpen(false);
		}
	}, [snackPack, messageInfo, open]);

	function handleClose(event, reason) {
		if (reason !== 'clickaway') {
			setOpen(false);
		}
	}

	function handleExited() {
		setMessageInfo(null);
	}

	return (
		<Snackbar
			key={messageInfo ? messageInfo.key : null}
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
					width: '100%',
					fontSize: 'h6.fontSize',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				{messageInfo ? messageInfo.message : null}
			</Alert>
		</Snackbar>
	);
}
