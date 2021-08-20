import { useEffect, useState } from 'react';

import { Button, styled } from '@material-ui/core';
import { FavoriteBorderRounded, FavoriteRounded } from '@material-ui/icons';

import { compliments } from '../assets';

const ActionButton = styled(Button)(({ theme }) => ({
	flex: '1 1 0',
	margin: 0,
	padding: theme.spacing(3, 0, 3, 3),
	borderRadius: 0,
	'&:active': {
		backgroundColor: 'transparent',
	},
}));

const TextWrapper = styled('div')({
	width: 150,
	textAlign: 'left',
});

const maxLikes = 7;

export default function LikeButton(props) {
	const { children } = props;

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
		const timeout = setTimeout(() => {
			setCompliment(null);
		}, 3000);

		return () => {
			clearTimeout(timeout);
		};
	}, [compliment]);

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
			<TextWrapper>{compliment ? compliment : children}</TextWrapper>
		</ActionButton>
	);
}
