import { useState } from 'react';

import { IconButton, styled, Tooltip, Typography } from '@material-ui/core';
import { FavoriteBorderRounded, FavoriteRounded } from '@material-ui/icons';

const Container = styled('div')({
	display: 'flex',
	alignItems: 'center',
});

const maxLikes = 7;

export default function LikeIconButton() {
	const [likes, setLikes] = useState(0);

	function handleClick() {
		if (likes < maxLikes) {
			setLikes((prev) => prev + 1);
		}
	}

	const title = likes < maxLikes ? `${maxLikes - likes} remaining` : `Thanks!`;

	return (
		<Container>
			<Tooltip title={title} placement="bottom-start">
				<IconButton
					edge="start"
					color="success"
					disableRipple={likes >= maxLikes}
					onClick={handleClick}
				>
					{likes >= maxLikes ? <FavoriteRounded /> : <FavoriteBorderRounded />}
				</IconButton>
			</Tooltip>
			<Typography fontWeight={800}>{likes}</Typography>
		</Container>
	);
}
