import { useEffect, useState } from 'react';

import { useParams } from 'react-router';

import { useSelector } from 'react-redux';

import { Button, styled } from '@mui/material';
import { FavoriteBorderRounded, FavoriteRounded } from '@mui/icons-material';

import { maxPossibleLikes } from '../assets';
import { get } from '../utils';
import { useHandleLike } from '../hooks/useHandleLike';

const ActionButton = styled(Button)(({ theme }) => ({
	flex: '1 1 0',
	margin: 0,
	padding: theme.spacing(3, 0, 3, 3),
	'&:active': {
		backgroundColor: 'transparent',
	},
}));

const TextWrapper = styled('div')({
	width: 170,
	textAlign: 'left',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	lineBreak: 'none',
	whiteSpace: 'nowrap',
});

export default function LikeButton(props) {
	const { children } = props;

	const { id } = useParams();
	const [compliment, setCompliment] = useState(null);
	const [userLikes, setUserLikes] = useState(0);
	const searchData = useSelector((state) => state.searchData);
	const handleClick = useHandleLike(id, userLikes, setCompliment);

	// Sync IndexedDB value to local state on mount and after "like" from either button
	useEffect(() => {
		get(id).then((val) => {
			setUserLikes(val || 0);
		});
	}, [id, searchData]);

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
			sx={{ borderRadius: { mobile: '0 16px 0 0', tablet: 0 } }}
		>
			<TextWrapper>{compliment || children}</TextWrapper>
		</ActionButton>
	);
}
