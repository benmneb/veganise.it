import { useState, useEffect } from 'react';

import { IconButton, styled, Tooltip, Typography } from '@material-ui/core';
import { FavoriteBorderRounded, FavoriteRounded } from '@material-ui/icons';

import { compliments } from '../assets';

const Container = styled('div')({
	display: 'flex',
	alignItems: 'center',
});

const maxLikes = 7;

export default function LikeIconButton() {
	const [likes, setLikes] = useState(0);
	const [compliment, setCompliment] = useState(null);

	function handleClick() {
		if (likes < maxLikes) {
			setLikes((prev) => prev + 1);
			setCompliment((prev) => {
				const others = compliments.filter((comp) => comp !== prev);
				return others[Math.floor(Math.random() * compliments.length)];
			});
		}
	}

	useEffect(() => {
		const clearCompliment = setTimeout(() => {
			setCompliment(null);
		}, 3000);

		return () => {
			clearTimeout(clearCompliment);
		};
	}, [compliment]);

	return (
		<Container>
			<Tooltip title="Compliment Tessy" placement="bottom-start">
				<IconButton
					edge="start"
					color="success"
					disableRipple={likes >= maxLikes}
					onClick={handleClick}
				>
					{likes >= maxLikes ? <FavoriteRounded /> : <FavoriteBorderRounded />}
				</IconButton>
			</Tooltip>
			<Typography fontWeight={800}>
				{compliment ? compliment : likes}
			</Typography>
		</Container>
	);
}
