import * as React from 'react';
import {
	styled,
	Card as MuiCard,
	CardContent,
	Typography,
	CardMedia,
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
	cursor: 'pointer',
	width: '100%',
	height: 400,
	position: 'relative',
	boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
	transition: `${theme.transitions.duration.complex}ms`,
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 16px 24px 0 rgba(0,0,0,0.12)',
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
				<Typography variant="h6" color="text.secondary" gutterBottom>
					🤤 x 4
				</Typography>
			</Content>
		</Card>
	);
}
