import { forwardRef, useState } from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import { Dialog, Fade, styled, useMediaQuery } from '@material-ui/core';

import { Recipe, Submit } from './index';

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
			{location.pathname === '/submit' ? (
				<Submit close={handleClose} />
			) : (
				<Recipe close={handleClose} />
			)}
		</RecipeModal>
	);
}
