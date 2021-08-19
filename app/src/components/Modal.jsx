import { forwardRef, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { Dialog, Fade, useMediaQuery } from '@material-ui/core';

import { Recipe } from './index';

const Transition = forwardRef((props, ref) => {
	const history = useHistory();

	return (
		<Fade
			ref={ref}
			{...props}
			onExited={() => {
				history.goBack();
			}}
		/>
	);
});

export default function Modal(props) {
	const [open, setOpen] = useState(props.open);

	const mobile = useMediaQuery((theme) => theme.breakpoints.only('mobile'));

	function handleClose() {
		setOpen(false);
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			TransitionComponent={Transition}
			scroll="body"
			maxWidth="tablet"
			fullWidth
			fullScreen={mobile}
		>
			<Recipe close={handleClose} />
		</Dialog>
	);
}
