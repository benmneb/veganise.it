import { useState, useEffect, useCallback } from 'react';

import { useParams } from 'react-router';

import { useSelector } from 'react-redux';

import { IconButton, styled, Typography } from '@mui/material';
import { FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material';

import { maxPossibleLikes } from '../assets';
import { get } from '../utils';
import { useHandleLike } from '../hooks/useHandleLike';

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

	const { id } = useParams();
	const [compliment, setCompliment] = useState(null);
	const [userLikes, setUserLikes] = useState(0);
	const searchData = useSelector((state) => state.searchData);
	const handleClick = useHandleLike(id, userLikes, setCompliment);

	const setIndexedDbLikesToLocalState = useCallback(() => {
		get(id).then((val) => {
			setUserLikes(val || 0);
		});
	}, [id]);

	// Sync IndexedDB value to local state on mount and after "like" from either button
	useEffect(() => {
		setIndexedDbLikesToLocalState();
	}, [setIndexedDbLikesToLocalState, searchData]);

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
