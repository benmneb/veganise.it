import { forwardRef, useState } from 'react';

import { useHistory, useParams } from 'react-router-dom';

import { Dialog, Fade } from '@material-ui/core';

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

	const { id } = useParams();

	function handleClose() {
		setOpen(false);
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			TransitionComponent={Transition}
			scroll="body"
		>
			<Recipe id={id} />
		</Dialog>
	);
}
