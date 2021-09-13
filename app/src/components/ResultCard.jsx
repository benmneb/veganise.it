import * as React from 'react';

import {
	styled,
	Card as MuiCard,
	CardContent,
	Typography,
	CardMedia,
} from '@mui/material';
import { FavoriteBorderRounded } from '@mui/icons-material';

import { useHistory, useLocation } from 'react-router-dom';

import { sessionLikesVar } from '../cache';

const Card = styled(MuiCard)(({ theme }) => ({
	cursor: 'zoom-in',
	width: '100%',
	maxWidth: 700,
	height: 500,
	placeSelf: 'center',
	position: 'relative',
	boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
	transition: `${theme.transitions.duration.complex}ms`,
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 16px 24px 0 rgba(0, 0, 0, 0.12)',
	},
}));

const Media = styled(CardMedia)({
	height: 350,
});

const Content = styled(CardContent)({
	textAlign: 'center',
});

const LikeIcon = styled((props) => (
	<FavoriteBorderRounded color="favorite" {...props} />
))(({ theme }) => ({
	marginRight: theme.spacing(1),
}));

export default function ResultCard(props) {
	const { recipe } = props;

	const history = useHistory();
	const location = useLocation();

	function handleClick() {
		return history.push({
			pathname: `/recipe/${recipe._id}`,
			state: { background: location },
		});
	}

	return (
		<Card component="article" onClick={handleClick}>
			<Media image="https://picsum.photos/320/" />
			<Content>
				<Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
					{recipe.title}
				</Typography>
				<Typography
					variant="h6"
					component="h2"
					color="text.secondary"
					gutterBottom
				>
					by {recipe.author}
				</Typography>
				<Typography
					variant="h6"
					color="text.secondary"
					component="div"
					display="flex"
					justifyContent="center"
					alignItems="center"
					gutterBottom
				>
					<LikeIcon />{' '}
					{sessionLikesVar()[recipe._id] !== undefined
						? recipe.likes + sessionLikesVar()[recipe._id]
						: recipe.likes}
				</Typography>
			</Content>
		</Card>
	);
}
