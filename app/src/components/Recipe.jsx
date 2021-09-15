import { useState, useEffect } from 'react';

import { useParams, useLocation, useHistory } from 'react-router';

import { useSelector, useDispatch } from 'react-redux';

import {
	Button,
	DialogContent,
	DialogTitle,
	IconButton,
	styled,
	Tooltip,
	Typography,
	useMediaQuery,
} from '@mui/material';
import {
	ShareRounded,
	OpenInNewRounded,
	CancelRounded,
} from '@mui/icons-material';

import { LikeIconButton, LikeButton, ShareMenu, Appbar } from './index';
import { api } from '../assets';
import { setSearchResults } from '../state';

const Content = styled(DialogContent)(({ theme }) => ({
	cursor: 'auto',
}));

const Header = styled(DialogTitle)({
	display: 'flex',
	padding: 0,
});

const Titles = styled('div')({
	flexGrow: 1,
});

const IconActions = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'flex-start',
	[theme.breakpoints.only('mobile')]: {
		flexDirection: 'column-reverse',
		justifyContent: 'flex-end',
	},
}));

const Overview = styled('div')(({ theme }) => ({
	width: '100%',
	marginBottom: theme.spacing(2),
}));

const Image = styled('div')(({ theme }) => ({
	backgroundImage: `linear-gradient(180deg, ${theme.palette.background.default} 0%, rgba(0,0,0,0) 100%), url(https://picsum.photos/720/480)`,
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	margin: theme.spacing(-16, -3, 2),
	height: 400,
}));

const Details = styled('div')(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
	gap: theme.spacing(3),
	marginBottom: theme.spacing(2),
}));

const Ingredients = styled('div')({});

const Method = styled('div')({});

const Actions = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'stretch',
	margin: theme.spacing(1, -3, -2.5, -3),
	padding: 0,
	[theme.breakpoints.only('mobile')]: {
		flexDirection: 'column',
	},
}));

const ActionButton = styled(Button)(({ theme }) => ({
	flex: '1 1 0',
	margin: 0,
	padding: theme.spacing(3, 0),
	borderRadius: 0,
}));

export default function Recipe(props) {
	const { close } = props;

	const location = useLocation();
	const history = useHistory();
	const { id } = useParams();
	const dispatch = useDispatch();
	const searchResults = useSelector((state) => state.searchResults);
	const mobile = useMediaQuery((theme) => theme.breakpoints.only('mobile'));
	const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
	const [recipe, setRecipe] = useState(null);

	const background = location.state?.background;

	// get recipe data on mount
	// this is also responsible for updating the like count "in real time"
	useEffect(() => {
		if (!searchResults) {
			// if theres no search results in redux, it means they came from a link etc
			// so it needs to be fetched
			(async () => {
				try {
					const response = await api.get(`/recipe/${id}`);
					const recipeData = response.data.data;
					// need to set search results so it can be updated when liking it
					dispatch(setSearchResults({ length: 1, data: [recipeData] }));
					setRecipe(recipeData);
				} catch (error) {
					console.error(error.message);
				}
			})();
		} else {
			// else get data from the searchResults data array already in redux
			// this is responsible for updating the like count "in real time"
			setRecipe(searchResults.data.find((recipe) => recipe._id === id));
		}
	}, [searchResults, id, dispatch]);

	async function handleShare(event) {
		if (navigator.share && mobile) {
			try {
				const response = await navigator.share({
					title: 'Veganise It!',
					text: 'Check out this vegan recipe! 🤤',
					url: window.location.href,
				});
				console.log('Shared via Web Share API:', response);
			} catch (error) {
				if (error.message !== 'Abort due to cancellation of share.') {
					console.error('Error sharing via Web Share API:', error.message);
				}
			}
		} else {
			setShareMenuAnchor(event.currentTarget);
		}
	}

	function closeShareMenu() {
		setShareMenuAnchor(null);
	}

	function handleViewSource() {
		return window.open(`${recipe?.url}?ref=veganise.it`, '_blank', 'noopener');
	}

	function handleClose() {
		if (background) return close();
		// reset searchResults so Home.jsx doesn't try to do a search
		dispatch(setSearchResults(null));
		history.push('/');
	}

	return (
		<>
			{!background && <Appbar />}
			<Content>
				<Header component="header">
					<Titles>
						<Typography variant="h4" component="h1">
							{recipe?.title}
						</Typography>
						<Typography variant="h6" component="h2">
							by {recipe?.author}
						</Typography>
						<LikeIconButton currentLikes={recipe?.likes} />
					</Titles>
					<IconActions>
						<Tooltip
							title="Feed a friend"
							placement={mobile ? 'left' : 'bottom'}
						>
							<IconButton
								size={mobile ? 'medium' : 'large'}
								onClick={handleShare}
							>
								<ShareRounded />
							</IconButton>
						</Tooltip>
						<Tooltip title="View source" placement={mobile ? 'left' : 'bottom'}>
							<IconButton
								size={mobile ? 'medium' : 'large'}
								onClick={handleViewSource}
							>
								<OpenInNewRounded />
							</IconButton>
						</Tooltip>
						<Tooltip
							title="Close recipe"
							placement={mobile ? 'left' : 'bottom-end'}
						>
							<IconButton
								size={mobile ? 'medium' : 'large'}
								edge="end"
								onClick={handleClose}
							>
								<CancelRounded />
							</IconButton>
						</Tooltip>
					</IconActions>
				</Header>
				<Image />
				<Overview>
					{recipe?.about && (
						<>
							<Typography variant="h5" gutterBottom>
								💬 About
							</Typography>
							{recipe.about.map((paragraph) => (
								<Typography key={paragraph} paragraph>
									{paragraph}
								</Typography>
							))}
						</>
					)}
				</Overview>
				<Details>
					<Ingredients>
						<Typography variant="h5" gutterBottom>
							🛒 Ingredients
						</Typography>
						{/* {recipe?.ingredients} */}
					</Ingredients>
					<Method>
						<Typography variant="h5" gutterBottom>
							🧑‍🍳 Method
						</Typography>
						{/* {recipe?.method} */}
					</Method>
				</Details>
				<Actions color="inherit">
					<ActionButton
						size="large"
						color="inherit"
						startIcon={<ShareRounded />}
						onClick={handleShare}
					>
						Feed a friend
					</ActionButton>
					<LikeButton>Compliment the chef</LikeButton>
					{mobile ? (
						<ActionButton
							size="large"
							color="inherit"
							startIcon={<CancelRounded />}
							onClick={handleClose}
						>
							Close
						</ActionButton>
					) : (
						<ActionButton
							size="large"
							color="inherit"
							startIcon={<OpenInNewRounded />}
							onClick={handleViewSource}
						>
							View source
						</ActionButton>
					)}
				</Actions>
				<ShareMenu
					anchor={shareMenuAnchor}
					open={Boolean(shareMenuAnchor)}
					close={closeShareMenu}
				/>
			</Content>
		</>
	);
}
