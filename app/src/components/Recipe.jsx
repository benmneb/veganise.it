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
	OpenInNewRounded,
	CancelRounded,
	VideoLibraryRounded,
} from '@mui/icons-material';

import {
	LikeIconButton,
	LikeButton,
	ShareMenu,
	Appbar,
	Lightbox,
	BottomNavBar,
} from './index';
import { api, ShareIcon, titlise, Link } from '../utils';
import { setSearchData, showSnackbar } from '../state';

const Content = styled(DialogContent)({
	cursor: 'auto',
});

const Header = styled(DialogTitle)({
	display: 'flex',
	padding: 0,
});

const Titles = styled('div')({
	flexGrow: 1,
	cursor: 'context-menu',
});

const IconActions = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'flex-start',
	height: 'max-content',
	[theme.breakpoints.only('mobile')]: {
		flexDirection: 'column-reverse',
		justifyContent: 'flex-end',
	},
}));

const Image = styled('div')(({ theme }) => ({
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	margin: theme.spacing(-16, -3, 2),
	height: '70vh',
	maxHeight: 700,
	cursor: 'zoom-in',
}));

const Overview = styled('div')(({ theme }) => ({
	width: '100%',
	marginBottom: theme.spacing(2),
	userSelect: 'text',
}));

const OverviewBody = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	gap: theme.spacing(2),
	[theme.breakpoints.only('mobile')]: {
		flexDirection: 'column',
		gap: 0,
	},
}));

const About = styled('div')(({ theme }) => ({
	flexShrink: '1',
}));

const Stats = styled('div')(({ theme }) => ({
	borderLeft: `1px solid ${theme.palette.grey[300]}`,
	padding: theme.spacing(2),
	height: 'max-content',
	minWidth: 'max-content',
}));

const Details = styled('div')(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
	gap: theme.spacing(3),
	marginBottom: theme.spacing(2),
	userSelect: 'text',
}));

const Features = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: theme.spacing(2),
	marginBottom: theme.spacing(2),
	[theme.breakpoints.only('mobile')]: {
		flexDirection: 'column',
		alignItems: 'stretch',
	},
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
		paddingBottom: 74.25, // height of BottomNavBar
	},
}));

const Nutrition = styled('div')(({ theme }) => ({
	marginBottom: theme.spacing(2),
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
	const [lightboxData, setLightboxData] = useState(null);

	const background = location.state?.background;

	// get recipe data on mount
	// this is also responsible for updating the like count "in real time"
	useEffect(() => {
		if (!searchData) {
			// no search results means they came from a link or refershed the page
			// so it needs to be fetched
			(async () => {
				try {
					const request = await api.get(`/recipe/${id}`);
					const response = request.data;

					if (!response.success) {
						console.error('Recipe not found:', response.message);
						dispatch(
							showSnackbar({
								message: 'Recipe not found! Try searching for it?',
								severity: 'error',
							})
						);
						return history.replace('/');
					}

					const recipeData = response.data;

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
	}, [searchData, id, dispatch, background, history]);

	async function handleShare(event) {
		if (navigator.share && mobile) {
			try {
				await navigator.share({
					title: 'Veganise It!',
					text: 'Check out this vegan recipe! 🤤',
					url: window.location.href,
				});
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

	function openLightbox(media) {
		if (media === 'image') {
			return setLightboxData({
				url: recipe?.image,
				type: 'image',
				altTag: `${recipe.title} by ${recipe.author} on Veganise It!`,
			});
		}

		if (media === 'video') {
			return setLightboxData({
				url: recipe?.video?.replace('watch?v=', 'embed/'),
				type: 'video',
				title: `${recipe.title} by ${recipe.author} on Veganise It!`,
			});
		}

		throw new Error(
			`Lightbox media must be either "image" or "video", received ${media}`
		);
	}

	function closeLightbox() {
		setLightboxData(null);
	}

	return (
		<>
			{!background && <Appbar />}
			<Content>
				<Header component="header">
					<Titles>
						<Typography variant="h4" component="h1">
							{recipe?.title && titlise(recipe.title)}
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
				<Image
					onClick={() => openLightbox('image')}
					sx={{
						backgroundImage: (theme) =>
							`linear-gradient(180deg, ${theme.palette.background.default} 0%, rgba(0,0,0,0) 30%), url(${recipe?.image})`,
					}}
				/>
				<Overview>
					{mobile && recipe?.video && (
						<Button
							startIcon={<VideoLibraryRounded color="youtube" />}
							variant="outlined"
							size="large"
							color="inherit"
							sx={{ mb: 2, width: '100%' }}
							onClick={() => openLightbox('video')}
						>
							Watch how it's made!
						</Button>
					)}
					{(recipe?.about || recipe?.stats || recipe?.difficulty) && (
						<Typography variant="h5" paragraph>
							💬 About
						</Typography>
					)}
					<OverviewBody>
						{(recipe?.about || recipe?.difficulty) && (
							<About>
								{recipe?.about?.map((paragraph) => (
									<Typography key={paragraph} paragraph>
										{paragraph}
									</Typography>
								))}
								{recipe?.difficulty && (
									<Typography paragraph>
										Difficulty: {recipe.difficulty}
									</Typography>
								)}
							</About>
						)}
						{recipe?.stats && (
							<Stats>
								{recipe.stats.map((stat) => (
									<Typography key={stat}>{stat}</Typography>
								))}
							</Stats>
						)}
					</OverviewBody>
				</Overview>
				{recipe?.features && (
					<Features>
						<div>
							<Typography fontWeight="bold" component="span">
								This recipe features:{' '}
							</Typography>
							{recipe.features.map((product, i) => (
								<span key={product}>
									<Link
										href={`https://vomad.guide/search/${product
											.replace(/\s/g, '+')
											.toLowerCase()}?ref=veganise.it`}
										target="_blank"
										rel="noopener"
									>
										{titlise(product)}
									</Link>
									{i === recipe.features.length - 1 ? '' : ', '}
								</span>
							))}
						</div>
						<Button
							variant="outlined"
							color="inherit"
							endIcon={<OpenInNewRounded />}
							sx={{ minWidth: 250 }}
							onClick={() =>
								window.open('https://vomad.guide?ref="veganise.it', '_blank')
							}
						>
							Find Vegan Products Near You
						</Button>
					</Features>
				)}
				<Details>
					{(recipe?.ingredients || recipe?.['before you start']) && (
						<Ingredients>
							{recipe?.['before you start'] && (
								<>
									<Typography variant="h5" paragraph>
										☝️ Before you start
									</Typography>
									<Typography paragraph component="ul" paddingLeft={3}>
										{recipe?.['before you start'].map((item) => (
											<Typography key={item} component="li">
												{item}
											</Typography>
										))}
									</Typography>
								</>
							)}
							{recipe?.ingredients && (
								<>
									<Typography variant="h5" paragraph>
										🛒 Ingredients
									</Typography>
									<Typography paragraph component="div">
										{Object.entries(recipe.ingredients).map((entry) => (
											<div key={entry[0]}>
												{entry[0] !== 'default' && (
													<Typography paragraph fontWeight="bold">
														{titlise(entry[0])}
													</Typography>
												)}
												<Typography paragraph component="ul" paddingLeft={3}>
													{entry[1].map((subEntry) => (
														<Typography key={subEntry} component="li">
															{subEntry}
														</Typography>
													))}
												</Typography>
											</div>
										))}
									</Typography>
								</>
							)}
						</Ingredients>
					)}
					<Method>
						{(recipe?.method || recipe?.video) && (
							<Typography variant="h5" paragraph>
								🧑‍🍳 Method
							</Typography>
						)}
						{recipe?.video && (
							<Button
								startIcon={<VideoLibraryRounded color="youtube" />}
								variant="outlined"
								size="large"
								color="inherit"
								sx={{ mb: 2 }}
								onClick={() => openLightbox('video')}
							>
								{mobile ? 'Watch video instructions' : "Watch how it's made!"}
							</Button>
						)}
						{recipe?.method &&
							Object.entries(recipe.method).map((entry) => (
								<div key={entry[0]}>
									{entry[0] !== 'default' && (
										<Typography paragraph fontWeight="bold">
											{titlise(entry[0])}
										</Typography>
									)}
									<Typography paragraph component="div">
										{entry[1].map((subEntry, i) => (
											<Typography key={subEntry} paragraph>
												<strong>
													{subEntry[0] === '*' ? '' : `${i + 1}.`}
												</strong>{' '}
												{subEntry}
											</Typography>
										))}
									</Typography>
								</div>
							))}
					</Method>
				</Details>
				{recipe?.nutrition && (
					<Nutrition>
						<Typography fontWeight="bold" component="span">
							Nutrition Information:{' '}
						</Typography>
						{recipe?.nutrition.map((nut, i) => (
							<span key={nut}>
								{nut}
								{i === recipe.nutrition.length - 1 ? '' : ', '}
							</span>
						))}
					</Nutrition>
				)}
				<Actions color="inherit">
					<ActionButton
						size="large"
						color="inherit"
						startIcon={<ShareIcon color="action" />}
						onClick={handleShare}
					>
						Feed a friend
					</ActionButton>
					{!mobile && (
						<>
							<LikeButton>Compliment the chef</LikeButton>
							<ActionButton
								size="large"
								color="inherit"
								startIcon={<CancelRounded color="action" />}
								onClick={handleClose}
							>
								Close
							</ActionButton>
						</>
					)}
				</Actions>
				<ShareMenu
					anchor={shareMenuAnchor}
					open={Boolean(shareMenuAnchor)}
					close={closeShareMenu}
				/>
			</Content>
			{mobile && (
				<BottomNavBar handleClose={handleClose} background={background} />
			)}
			<Lightbox
				open={Boolean(lightboxData)}
				handleClose={closeLightbox}
				data={lightboxData || {}}
				startIndex={0}
			/>
		</>
	);
}
