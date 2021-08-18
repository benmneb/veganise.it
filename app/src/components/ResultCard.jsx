import * as React from 'react';

import {
	styled,
	Card as MuiCard,
	CardContent,
	Typography,
	CardMedia,
} from '@material-ui/core';
import { FavoriteBorderRounded } from '@material-ui/icons';

import { useHistory, useLocation } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
	cursor: 'pointer',
	width: '100%',
	height: 400,
	position: 'relative',
	boxShadow: `0 ${theme.spacing()} ${theme.spacing(3)} 0 ${
		theme.palette.action.focus
	}`,
	transition: `${theme.transitions.duration.complex}ms`,
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: `0 ${theme.spacing(2)} ${theme.spacing(3)} 0 ${
			theme.palette.action.focus
		}`,
	},
}));

const Media = styled(CardMedia)({
	height: 250,
});

const Content = styled(CardContent)({
	textAlign: 'center',
});

export default function ResultCard() {
	const history = useHistory();
	const location = useLocation();

	function handleClick() {
		return history.push({
			pathname: '/recipe/123',
			state: { background: location },
		});
	}

	return (
		<Card component="article" onClick={handleClick}>
			<Media image="https://picsum.photos/320/" />
			<Content>
				<Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
					Spaghetti Bolognese v3
				</Typography>
				<Typography
					variant="h6"
					component="h2"
					color="text.secondary"
					gutterBottom
				>
					by Tess Begg
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
					<FavoriteBorderRounded color="favourite" /> x4
				</Typography>
			</Content>
		</Card>
	);
}
