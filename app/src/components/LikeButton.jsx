import { useEffect, useState, useRef } from 'react';

import { useParams } from 'react-router';

import { gql, useMutation, useReactiveVar } from '@apollo/client';

import { Button, styled } from '@material-ui/core';
import { FavoriteBorderRounded, FavoriteRounded } from '@material-ui/icons';

import { compliments } from '../assets';
import { get, update } from '../utils';
import { sessionLikesVar, indexedDbLikesVar } from '../cache';

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

const maxPossibleLikes = 7;

const ADD_LIKE = gql`
	mutation Like($id: String!) {
		like(id: $id) {
			likes
		}
	}
`;

export default function LikeButton(props) {
	const { children } = props;

	const { id } = useParams();
	const [like] = useMutation(ADD_LIKE);
	const [compliment, setCompliment] = useState(null);

	const sessionLikes = useReactiveVar(sessionLikesVar)[id];
	const indexedDbLikes = useReactiveVar(indexedDbLikesVar)[id];
	const indexedDbLikesRef = useRef(undefined);

	function handleClick() {
		if ((indexedDbLikes || 0) < maxPossibleLikes) {
			// add to mongo via graphQL for long term storage
			like({ variables: { id } });
			// add to reactive var to update ui based on like count for this session
			sessionLikesVar({
				...sessionLikesVar(),
				[id]: (sessionLikesVar()[id] = (sessionLikes || 0) + 1),
			});
			console.log('sessionLikesVar:', sessionLikesVar());
			// add to indexedDb to track "temp user" like count long-term
			update(id, (val) => (val || 0) + 1)
				.then(() => console.log('indexedDb set after click'))
				.catch((err) => console.error('error updating indexedDb:', err));
			// set a random compliment thats not the one immediately preceeding it
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

		// get latest indexedDb value on each render
		// for tracking "temp user" like count long-term
		get(id).then((val) => {
			if (val && val !== indexedDbLikesRef.current) {
				indexedDbLikesVar({
					...indexedDbLikesVar(),
					[id]: (indexedDbLikesVar()[id] = (indexedDbLikesVar()[id] || 0) + 1),
				});
				indexedDbLikesRef.current = val;
				console.log('put indexedDb in reactive var:', val);
			}
		});

		return () => {
			clearTimeout(clearCompliment);
		};
	}, [compliment, id]);

	return (
		<ActionButton
			size="large"
			color="inherit"
			disableRipple={
				indexedDbLikes >= maxPossibleLikes || sessionLikes >= maxPossibleLikes
			}
			onClick={handleClick}
			startIcon={
				indexedDbLikes >= maxPossibleLikes ||
				sessionLikes >= maxPossibleLikes ? (
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
