import { useState } from 'react';

import { Button, styled } from '@material-ui/core';
import { FavoriteBorderRounded, FavoriteRounded } from '@material-ui/icons';

const ActionButton = styled(Button)(({ theme }) => ({
	flex: '1 1 0',
	margin: 0,
	padding: theme.spacing(3, 0),
	borderRadius: 0,
}));

const maxLikes = 7;

export default function LikeButton(props) {
	const { children } = props;

	const [likes, setLikes] = useState(0);

	function handleClick() {
		if (likes < maxLikes) {
			setLikes((prev) => prev + 1);
		}
	}

	return (
		<ActionButton
			size="large"
			color="inherit"
			disableRipple={likes >= maxLikes}
			onClick={handleClick}
			startIcon={
				likes >= maxLikes ? (
					<FavoriteRounded color="success" edge="start" />
				) : (
					<FavoriteBorderRounded color="success" edge="start" />
				)
			}
		>
			{children}
		</ActionButton>
	);
}
