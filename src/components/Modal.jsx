import { forwardRef, useState } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import { Dialog, Grow, styled, useMediaQuery } from '@mui/material';

import { Recipe, Submit, Advertise } from './index';

const Transition = forwardRef((props, ref) => {
	const history = useHistory();

	return (
		<Grow
			ref={ref}
			{...props}
			onExited={() => {
				history.goBack();
			}}
		/>
	);
});

const RecipeModal = styled(Dialog)({
	cursor: 'zoom-out',
});

export default function Modal(props) {
	const location = useLocation();
	const [open, setOpen] = useState(props.open);

	const mobile = useMediaQuery((theme) => theme.breakpoints.only('mobile'));

	function handleClose() {
		setOpen(false);
	}

	function getContent(pathname) {
		if (pathname === '/submit') return <Submit close={handleClose} />;
		if (pathname === '/advertise') return <Advertise close={handleClose} />;
		return <Recipe close={handleClose} />;
	}

	return (
		<RecipeModal
			open={open}
			onClose={handleClose}
			TransitionComponent={Transition}
			scroll="body"
			maxWidth="tablet"
			fullWidth
			fullScreen={mobile}
		>
			{getContent(location.pathname)}
		</RecipeModal>
	);
}
