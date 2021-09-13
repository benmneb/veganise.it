import { useState, useEffect, useRef } from 'react';

import { useParams } from 'react-router';

import { gql, useMutation, useReactiveVar } from '@apollo/client';

import { IconButton, styled, Typography } from '@mui/material';
import { FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material';

import { compliments, maxPossibleLikes } from '../assets';
import { get, update } from '../utils';
import { sessionLikesVar, indexedDbLikesVar } from '../cache';

const Container = styled('div')({
	display: 'flex',
	alignItems: 'center',
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
	'&:active': {
		backgroundColor: 'transparent',
	},
}));

const ADD_LIKE = gql`
	mutation Like($id: String!) {
		like(id: $id) {
			likes
		}
	}
`;

export default function LikeIconButton(props) {
	const { initialLikes } = props;

	const { id } = useParams();
	const [like] = useMutation(ADD_LIKE);
	const [compliment, setCompliment] = useState(null);

	const sessionLikes = useReactiveVar(sessionLikesVar)[id];
	const indexedDbLikes = useReactiveVar(indexedDbLikesVar)[id];
	const indexedDbLikesRef = useRef(undefined);

	function handleClick() {
		if (
			indexedDbLikesRef.current !== undefined &&
			(indexedDbLikes || 0) < maxPossibleLikes
		) {
			// add to mongo via graphQL for long term global storage
			like({ variables: { id } });
			// add to reactive var to update ui based on like count for this session
			sessionLikesVar({
				...sessionLikesVar(),
				[id]: (sessionLikesVar()[id] = (sessionLikes || 0) + 1),
			});
			// add to indexedDb to track "temp user" like count long-term (so they can't leave unlimited likes)
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
		}
	}

	// update indexedDb value to track "temp user" like count long-term
	useEffect(() => {
		get(id).then((val) => {
			indexedDbLikesVar({
				...indexedDbLikesVar(),
				[id]: val,
			});
			indexedDbLikesRef.current = val || 0;
		});
	}, [sessionLikes, id]);

	// clear random compliment
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
				disableRipple={
					indexedDbLikes >= maxPossibleLikes || sessionLikes >= maxPossibleLikes
				}
				onClick={handleClick}
			>
				{indexedDbLikes >= maxPossibleLikes ||
				sessionLikes >= maxPossibleLikes ? (
					<FavoriteRounded />
				) : (
					<FavoriteBorderRounded />
				)}
			</StyledIconButton>
			<Typography fontWeight={800}>
				{compliment
					? compliment
					: sessionLikes
					? sessionLikes + initialLikes
					: initialLikes}
			</Typography>
		</Container>
	);
}
