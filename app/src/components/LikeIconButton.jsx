import { useState, useEffect, useCallback } from 'react';

import { useParams } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';

import { IconButton, styled, Typography } from '@mui/material';
import { FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material';

import { compliments, maxPossibleLikes } from '../assets';
import { get, update, api } from '../utils';
import { like } from '../state';

const Container = styled('div')({
	display: 'flex',
	alignItems: 'center',
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
	'&:active': {
		backgroundColor: 'transparent',
	},
}));

export default function LikeIconButton(props) {
	const { currentLikes } = props;

	const dispatch = useDispatch();
	const { id } = useParams();
	const [compliment, setCompliment] = useState(null);
	const [userLikes, setUserLikes] = useState(0);
	const searchResults = useSelector((state) => state.searchResults);

	const setIndexedDbLikesToLocalState = useCallback(() => {
		get(id).then((val) => {
			setUserLikes(val || 0);
		});
	}, [id]);

	// sync indexDb value to local state on mount and after like from either button
	useEffect(() => {
		setIndexedDbLikesToLocalState();
	}, [setIndexedDbLikesToLocalState, searchResults]);

	async function handleClick() {
		if (userLikes >= maxPossibleLikes) return;

		try {
			// add to mongo for long term global storage
			await api.post('/like', { id });

			// update redux state so changes are reflected locally without a re-fetch
			dispatch(like(id));

			// add to indexedDb so they can't leave unlimited likes
			update(id, (val) => (val || 0) + 1).catch((err) =>
				console.error('error updating indexedDb:', err)
			);

			// set a random compliment thats not the one immediately preceeding it
			setCompliment(
				(prev) =>
					compliments.filter((comp) => comp !== prev)[
						Math.floor(Math.random() * compliments.length)
					]
			);
		} catch (error) {
			console.error(error.message);
		}
	}

	// clear random compliment after 3 seconds
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
			<StyledIconButton
				edge="start"
				color="favorite"
				disableRipple={userLikes >= maxPossibleLikes}
				onClick={handleClick}
			>
				{userLikes >= maxPossibleLikes ? (
					<FavoriteRounded />
				) : (
					<FavoriteBorderRounded />
				)}
			</StyledIconButton>
			<Typography fontWeight={800}>{compliment || currentLikes}</Typography>
		</Container>
	);
}
