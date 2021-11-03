import { useSelector, useDispatch } from 'react-redux';

import { styled, Alert, IconButton, Slide } from '@mui/material';
import { CloseRounded, GetAppRounded, CheckRounded } from '@mui/icons-material';

import { setDeferredInstallPrompt } from '../state';

const Prompt = styled(Alert)(({ theme }) => ({
	position: 'fixed',
	bottom: 0,
	left: 0,
	right: 0,
	alignItems: 'center',
	borderRadius: theme.spacing(2, 2, 0, 0),
	backgroundColor: theme.palette.secondary.main + 'EE',
	fontSize: theme.typography.h4.fontSize,
	zIndex: theme.zIndex.snackbar,
	'& .MuiAlert-action': {
		aligntItems: 'center',
	},
	[theme.breakpoints.only('mobile')]: {
		fontSize: theme.typography.h5.fontSize,
	},
}));

export default function AddToHomeScreen() {
	const dispatch = useDispatch();

	const deferredInstallPrompt = useSelector(
		(state) => state.deferredInstallPrompt
	);

	// Check if PWA is installable on device.
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		dispatch(setDeferredInstallPrompt(e));
	});

	// Check if user has installed already.
	window.addEventListener('appinstalled', (e) => {
		dispatch(setDeferredInstallPrompt(null));
	});

	async function handleInstallClick() {
		deferredInstallPrompt.prompt();

		const result = await deferredInstallPrompt.userChoice;

		if (result.outcome === 'accepted') {
			dispatch(setDeferredInstallPrompt(null));
		}
	}

	return (
		<Slide
			in={Boolean(deferredInstallPrompt)}
			direction="up"
			mountOnEnter
			unmountOnExit={deferredInstallPrompt === null}
			component="aside"
		>
			<Prompt
				variant="filled"
				icon={<GetAppRounded fontSize="large" />}
				action={[
					<IconButton
						key="1"
						aria-label="add to home screen"
						color="inherit"
						onClick={handleInstallClick}
					>
						<CheckRounded fontSize="large" />
					</IconButton>,
					<IconButton
						key="2"
						aria-label="don't add to home screen"
						color="inherit"
						onClick={() => dispatch(setDeferredInstallPrompt(null))}
					>
						<CloseRounded fontSize="large" />
					</IconButton>,
				]}
			>
				Install the app to find vegan recipes even easier
			</Prompt>
		</Slide>
	);
}
