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
import { OpenInNewRounded, CancelRounded } from '@mui/icons-material';

import { LikeIconButton, LikeButton, ShareMenu, Appbar } from './index';
import { api, ShareIcon } from '../utils';
import { setSearchData } from '../state';

const Content = styled(DialogContent)({
	cursor: 'auto',
});

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
	const searchData = useSelector((state) => state.searchData);
	const mobile = useMediaQuery((theme) => theme.breakpoints.only('mobile'));
	const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
	const [recipe, setRecipe] = useState(null);

	const background = location.state?.background;

	// get recipe data on mount
	// this is also responsible for updating the like count "in real time"
	useEffect(() => {
		if (!searchData) {
			// no search results means they came from a link or refershed the page
			// so it needs to be fetched
			(async () => {
				try {
					const response = await api.get(`/recipe/${id}`);
					const recipeData = response.data.data;

					// need to set data in redux so it can be updated when liking it
					// but only if there's no background state (because its already there otherwise)
					if (!background) {
						dispatch(setSearchData({ length: 1, results: [recipeData] }));
					}

					// set the data in local state for use in this component
					setRecipe(recipeData);
				} catch (error) {
					console.error(error.message);
				}
			})();
		} else {
			// otherwise get data from the searchData array already in redux
			// this `else` block is also responsible for updating the like count "in real time"
			setRecipe(searchData.results.find((recipe) => recipe._id === id));
		}
	}, [searchData, id, dispatch, background]);

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
		dispatch(setSearchData(null));
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
								<ShareIcon />
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
						startIcon={<ShareIcon />}
						onClick={handleShare}
					>
						Feed a friend
					</ActionButton>
					<LikeButton>Compliment the chef</LikeButton>
					<ActionButton
						size="large"
						color="inherit"
						startIcon={<CancelRounded color="action" />}
						onClick={handleClose}
					>
						Close
					</ActionButton>
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
