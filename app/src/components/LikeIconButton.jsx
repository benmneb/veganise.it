import { useState, useEffect } from 'react';

import { useParams } from 'react-router';

import { IconButton, styled, Tooltip, Typography } from '@material-ui/core';
import { FavoriteBorderRounded, FavoriteRounded } from '@material-ui/icons';

import { compliments } from '../assets';
import { get, update } from '../utils';

const Container = styled('div')({
	display: 'flex',
	alignItems: 'center',
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
	'&:active': {
		backgroundColor: 'transparent',
	},
}));

const maxLikes = 7;

export default function LikeIconButton() {
	const [likes, setLikes] = useState(0);
	const [compliment, setCompliment] = useState(null);
	const { id } = useParams();

	function handleClick() {
		if (likes < maxLikes) {
			update(id, (val) => (val || 0) + 1)
				.then(() => console.log('set!'))
				.catch((err) => console.error('error updating:', err));
			setCompliment(
				(prev) =>
					compliments.filter((comp) => comp !== prev)[
						Math.floor(Math.random() * compliments.length)
					]
			);
		}
	}

	useEffect(() => {
		const clearCompliment = setTimeout(() => {
			setCompliment(null);
		}, 3000);

		get(id).then((val) => {
			console.log('got:', val);
			if (val) setLikes(val);
		});

		return () => {
			clearTimeout(clearCompliment);
		};
	}, [compliment, id]);

	return (
		<Container>
			<Tooltip title="Compliment Tessy" placement="bottom-start">
				<StyledIconButton
					edge="start"
					color="success"
					disableRipple={likes >= maxLikes}
					onClick={handleClick}
				>
					{likes >= maxLikes ? <FavoriteRounded /> : <FavoriteBorderRounded />}
				</StyledIconButton>
			</Tooltip>
			<Typography fontWeight={800}>
				{compliment ? compliment : likes}
			</Typography>
		</Container>
	);
}
