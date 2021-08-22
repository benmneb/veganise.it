import { useState } from 'react';

import { useParams } from 'react-router';

import { gql, useQuery } from '@apollo/client';

import {
	Button,
	DialogContent,
	DialogTitle,
	IconButton,
	styled,
	Tooltip,
	Typography,
	useMediaQuery,
} from '@material-ui/core';
import {
	ShareRounded,
	OpenInNewRounded,
	CancelRounded,
} from '@material-ui/icons';

import { LikeIconButton, LikeButton, ShareMenu, Appbar } from './index';

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

const GET_RECIPE = gql`
	query Recipe($id: String!) {
		recipe(id: $id) {
			title
			author
			authorNickname
			likes
			url
			about
			ingredients
			method
		}
	}
`;

export default function Recipe(props) {
	const { close, isInModal } = props;

	const { id } = useParams();
	const mobile = useMediaQuery((theme) => theme.breakpoints.only('mobile'));
	const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
	const { error, loading, data } = useQuery(GET_RECIPE, {
		variables: { id },
	});

	if (loading) return 'Loading...';
	if (error) return `Error: ${error.message}`;

	async function handleShare(event) {
		if (navigator.share) {
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
		return window.open(
			`${data.recipe.url}?ref=veganise.it`,
			'_blank',
			'noopener'
		);
	}

	return (
		<>
			{!isInModal && <Appbar />}
			<Content>
				<Header component="header">
					<Titles>
						<Typography variant="h4" component="h1">
							{data.recipe.title}
						</Typography>
						<Typography variant="h6" component="h2">
							by {data.recipe.author}
						</Typography>
						<LikeIconButton initialLikes={data.recipe.likes} />
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
								onClick={close}
							>
								<CancelRounded />
							</IconButton>
						</Tooltip>
					</IconActions>
				</Header>
				<Image />
				<Overview>
					<Typography variant="h5" gutterBottom>
						💬 About
					</Typography>
					{data.recipe.about}
				</Overview>
				<Details>
					<Ingredients>
						<Typography variant="h5" gutterBottom>
							🛒 Ingredients
						</Typography>
						{data.recipe.ingredients}
					</Ingredients>
					<Method>
						<Typography variant="h5" gutterBottom>
							🧑‍🍳 Method
						</Typography>
						{data.recipe.method}
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
					<LikeButton>Compliment {data.recipe.authorNickname}</LikeButton>
					{mobile ? (
						<ActionButton
							size="large"
							color="inherit"
							startIcon={<CancelRounded />}
							onClick={close}
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
