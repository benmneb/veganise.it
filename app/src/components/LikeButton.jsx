import { useEffect, useState } from 'react';

import { useParams } from 'react-router';

import { Button, styled } from '@material-ui/core';
import { FavoriteBorderRounded, FavoriteRounded } from '@material-ui/icons';

import { compliments } from '../assets';
import { get, update } from '../utils';

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
