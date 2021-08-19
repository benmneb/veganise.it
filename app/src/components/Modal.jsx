import { forwardRef, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { Dialog, Fade, styled, useMediaQuery } from '@material-ui/core';

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

const RecipeModal = styled(Dialog)({
	cursor: 'zoom-out',
});

export default function Modal(props) {
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
			<Recipe close={handleClose} />
		</RecipeModal>
	);
}
