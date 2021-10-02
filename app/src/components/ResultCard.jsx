import {
	styled,
	Card as MuiCard,
	CardContent,
	Typography,
} from '@mui/material';
import {
	FavoriteBorderRounded,
	VideoLibraryRounded,
} from '@mui/icons-material';

import { useHistory, useLocation } from 'react-router-dom';

import Image from 'mui-image';

import { titlise } from '../utils';

const Card = styled(MuiCard)(({ theme }) => ({
	cursor: 'zoom-in',
	width: '100%',
	maxWidth: 700,
	height: 400,
	placeSelf: 'center',
	position: 'relative',
	boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
	transition: `${theme.transitions.duration.complex}ms`,
	'&:hover': {
		transform: 'translateY(-2px)',
		boxShadow: '0 16px 24px 0 rgba(0, 0, 0, 0.12)',
	},
	'&:active': {
		transform: 'scale(0.95)',
		boxShadow: '0 24px 32px 0 rgba(0, 0, 0, 0.22)',
	},
	'&:focus-visible': {
		transform: 'translateY(-2px)',
		boxShadow:
			'0 16px 24px 0 rgba(0, 0, 0, 0.12), 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5)',
		outline: 'none',
	},
}));

const Content = styled(CardContent)(({ theme }) => ({
	height: '33%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	'&:last-child': {
		padding: theme.spacing(2),
	},
}));

const Title = styled(Typography)({
	display: '-webkit-box',
	WebkitLineClamp: '2',
	WebkitBoxOrient: 'vertical',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
});

const Author = styled(Typography)(({ theme }) => ({
	whiteSpace: 'nowrap',
	margin: theme.spacing(0, 1, 0, 0),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
}));

const Footer = styled('div')({
	display: 'flex',
	justifyContent: 'space-between',
});

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

	function handleKeyDown(e) {
		if (e.key !== ' ' && e.key !== 'Enter') return;
		handleClick();
	}

	return (
		<Card
			component="article"
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			tabIndex="0"
		>
			<Image src={recipe.image} height="67%" shift="bottom" loading="lazy" />
			<Content>
				<Title variant="h5" component="h1" fontWeight="bold">
					{titlise(recipe.title)}
				</Title>
				<Footer>
					<Author variant="h6" component="h2" color="text.secondary">
						by {recipe.author}
					</Author>
					<Typography
						variant="h6"
						color="text.secondary"
						component="div"
						display="flex"
						justifyContent="center"
						alignItems="center"
					>
						{recipe.video && <VideoLibraryRounded sx={{ mr: 1 }} />}
						<FavoriteBorderRounded
							color="favorite"
							sx={{ mr: Boolean(recipe.likes) ? 1 : 0 }}
						/>{' '}
						{recipe.likes}
					</Typography>
				</Footer>
			</Content>
		</Card>
	);
}
