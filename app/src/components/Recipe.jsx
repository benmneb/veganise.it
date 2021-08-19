import { useState } from 'react';

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

import LikeIconButton from './LikeIconButton';
import LikeButton from './LikeButton';
import ShareMenu from './ShareMenu';

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
	textTransform: 'uppercase',
}));

export default function Recipe(props) {
	const { close } = props;

	const mobile = useMediaQuery((theme) => theme.breakpoints.only('mobile'));

	const [shareMenuAnchor, setShareMenuAnchor] = useState(null);

	function openShareMenu(event) {
		setShareMenuAnchor(event.currentTarget);
	}

	function closeShareMenu() {
		setShareMenuAnchor(null);
	}

	return (
		<Content>
			<Header component="header">
				<Titles>
					<Typography variant="h4" component="h1">
						Spag Bog of Glory
					</Typography>
					<Typography variant="h6" component="h2">
						by Tessy Begg
					</Typography>
					<LikeIconButton />
				</Titles>
				<IconActions>
					<Tooltip
						title="Don't be greedy"
						placement={mobile ? 'left' : 'bottom'}
					>
						<IconButton
							size={mobile ? 'medium' : 'large'}
							onClick={openShareMenu}
						>
							<ShareRounded />
						</IconButton>
					</Tooltip>
					<Tooltip title="View source" placement={mobile ? 'left' : 'bottom'}>
						<IconButton size={mobile ? 'medium' : 'large'}>
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
				Nori grape silver beet broccoli kombu beet greens fava bean potato
				quandong celery. Bunya nuts black-eyed pea prairie turnip leek lentil
				turnip greens parsnip. Sea lettuce lettuce water chestnut eggplant
				winter purslane fennel azuki bean earthnut pea sierra leone bologi leek
				soko chicory celtuce parsley jícama salsify.
			</Overview>
			<Details>
				<Ingredients>
					<Typography variant="h5" gutterBottom>
						🛒 Ingredients
					</Typography>
					Lorem ipsum dolor amet mustache knausgaard +1, blue bottle waistcoat
					tbh semiotics artisan synth stumptown gastropub cornhole celiac swag.
					Brunch raclette vexillologist post-ironic glossier ennui XOXO mlkshk
					godard pour-over blog tumblr humblebrag. Blue bottle put a bird on it
					twee prism biodiesel brooklyn. Blue bottle ennui tbh succulents.
				</Ingredients>
				<Method>
					<Typography variant="h5" gutterBottom>
						🧑‍🍳 Method
					</Typography>
					Lorem Ipsum is the single greatest threat. We are not - we are not
					keeping up with other websites. Lorem Ipsum best not make any more
					threats to your website. It will be met with fire and fury like the
					world has never seen. Does everybody know that pig named Lorem Ipsum?
					An ‘extremely credible source’ has called my office and told me that
					Barack Obama’s placeholder text is a fraud.
				</Method>
			</Details>
			<Actions color="inherit">
				<ActionButton
					size="large"
					color="inherit"
					startIcon={<ShareRounded />}
					onClick={openShareMenu}
				>
					Don't be greedy
				</ActionButton>
				<LikeButton>Compliment Tessy</LikeButton>
				<ActionButton
					size="large"
					color="inherit"
					startIcon={<OpenInNewRounded />}
				>
					View Source
				</ActionButton>
			</Actions>
			<ShareMenu
				anchor={shareMenuAnchor}
				open={Boolean(shareMenuAnchor)}
				close={closeShareMenu}
			/>
		</Content>
	);
}
