import { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet';

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
import { api, ShareIcon, titlise } from '../utils';
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

const Image = styled('div', {
	shouldForwardProp: (prop) => prop !== 'src',
})(({ src, theme }) => ({
	backgroundImage: `linear-gradient(180deg, ${theme.palette.background.default} 0%, rgba(0,0,0,0) 30%), url(${src})`,
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	margin: theme.spacing(-16, -3, 2),
	height: '70vh',
	maxHeight: 700,
	cursor: 'zoom-in',
	display: 'flex',
	alignItems: 'flex-end',
}));

const Body = styled('main', {
	shouldForwardProp: (prop) => prop !== 'isInModal',
})(({ isInModal }) => ({
	maxWidth: isInModal ? 'auto' : 750,
	margin: isInModal ? 0 : 'auto',
}));

const Overview = styled('div')(({ theme }) => ({
	width: '100%',
	marginBottom: theme.spacing(2),
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

const Stats = styled('div', {
	shouldForwardProp: (prop) => prop !== 'hasAbout',
})(({ hasAbout, theme }) => ({
	borderLeft: hasAbout ? `1px solid ${theme.palette.grey[300]}` : 'none',
	padding: hasAbout ? theme.spacing(2) : 0,
	height: 'max-content',
	minWidth: 200,
}));

const Details = styled('div')(({ theme }) => ({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
	gap: theme.spacing(3),
	marginBottom: theme.spacing(2),
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
			<Helmet>
				<title>
					{`${
						recipe ? `${titlise(recipe.title)} by ${recipe.author} @ ` : ''
					}Veganise It!`}
				</title>
				<meta
					name="description"
					content={
						recipe?.about
							? recipe.about
							: 'Veganise It is a curated collection of the internets most mouth-watering vegan recipes.'
					}
				/>
			</Helmet>
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
				<Image onClick={() => openLightbox('image')} src={recipe?.image}>
					{!recipe?.url.includes('sodeliciousdairyfree.com') && (
						<svg viewBox="0 0 1440 42" style={{ width: '110%' }}>
							<path
								fill="#fff"
								d="M 1440 21.2102 L 1440 44 L 0 44 L 0 21.2102 C 120 35.0701 240 42 360 42 C 480 42 600 35.0701 720 21.2102 C 808.3278 12.4164 874.5736 6.877 918.7375 4.5921 C 972.4917 1.8109 1026.2458 0.4204 1080 0.4204 C 1200 0.4204 1320 7.3503 1440 21.2102 Z"
							/>
						</svg>
					)}
				</Image>
				<Body isInModal={Boolean(background)}>
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
								<Stats hasAbout={Boolean(recipe?.about)}>
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
									Featured products:{' '}
								</Typography>
								{recipe.features.map((product, i) => (
									<span key={product}>
										{titlise(product)}
										{i === recipe.features.length - 1 ? '' : ', '}
									</span>
								))}
							</div>
							<Button
								variant="outlined"
								color="inherit"
								size="large"
								endIcon={<OpenInNewRounded />}
								sx={{ minWidth: 280 }}
								onClick={() =>
									window.open('https://vomad.guide?ref=veganise.it', '_blank')
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
										{!recipe?.features && (
											<Button
												variant="outlined"
												color="inherit"
												size="large"
												endIcon={<OpenInNewRounded />}
												sx={{ mb: 2, whiteSpace: 'nowrap', maxWidth: '100%' }}
												onClick={() =>
													window.open(
														'https://vomad.guide?ref=veganise.it',
														'_blank'
													)
												}
											>
												Find Vegan Products Near You
											</Button>
										)}
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
				</Body>
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
			</Content>
			{mobile && (
				<BottomNavBar handleClose={handleClose} background={background} />
			)}
			<ShareMenu
				anchor={shareMenuAnchor}
				open={Boolean(shareMenuAnchor)}
				close={closeShareMenu}
			/>
			<Lightbox
				open={Boolean(lightboxData)}
				handleClose={closeLightbox}
				data={lightboxData || {}}
				startIndex={0}
			/>
		</>
	);
}
