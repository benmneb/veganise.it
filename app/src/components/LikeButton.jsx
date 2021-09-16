import { useEffect, useState, useCallback } from 'react';

import { useParams } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';

import { Button, styled } from '@mui/material';
import { FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material';

import { compliments, maxPossibleLikes } from '../assets';
import { get, update, api } from '../utils';
import { like } from '../state';

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
	width: 170,
	textAlign: 'left',
});

export default function LikeButton(props) {
	const { children } = props;

	const dispatch = useDispatch();
	const { id } = useParams();
	const [compliment, setCompliment] = useState(null);
	const [userLikes, setUserLikes] = useState(0);
	const searchData = useSelector((state) => state.searchData);

	const setIndexedDbLikesToLocalState = useCallback(() => {
		get(id).then((val) => {
			setUserLikes(val || 0);
		});
	}, [id]);

	// sync indexDb value to local state on mount and after like from either button
	useEffect(() => {
		setIndexedDbLikesToLocalState();
	}, [setIndexedDbLikesToLocalState, searchData]);

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
		<ActionButton
			size="large"
			color="inherit"
			disableRipple={userLikes >= maxPossibleLikes}
			onClick={handleClick}
			startIcon={
				userLikes >= maxPossibleLikes ? (
					<FavoriteRounded color="favorite" />
				) : (
					<FavoriteBorderRounded color="favorite" />
				)
			}
		>
			<TextWrapper>{compliment || children}</TextWrapper>
		</ActionButton>
	);
}
