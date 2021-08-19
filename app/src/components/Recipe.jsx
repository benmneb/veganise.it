import {
	Button,
	DialogContent,
	DialogTitle,
	IconButton,
	styled,
	Tooltip,
	Typography,
} from '@material-ui/core';
import {
	ShareRounded,
	OpenInNewRounded,
	FavoriteBorderRounded,
	CancelRounded,
} from '@material-ui/icons';

const Header = styled(DialogTitle)({
	display: 'flex',
	padding: 0,
});

const Titles = styled('div')({
	flexGrow: 1,
});

const IconActions = styled('div')({
	display: 'flex',
	alignItems: 'flex-start',
});

const Overview = styled('div')(({ theme }) => ({
	width: '100%',
	marginBottom: theme.spacing(2),
}));

const Image = styled('div')(({ theme }) => ({
	backgroundImage: `url(https://picsum.photos/720/480)`,
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	margin: theme.spacing(2, -3),
	height: 300,
}));

const Details = styled('div')(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(3),
	marginBottom: theme.spacing(2),
}));

const Ingredients = styled('div')({
	width: '50%',
});

const Method = styled('div')({
	width: '50%',
});

const Actions = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'stretch',
	margin: theme.spacing(1, -3, -2.5, -3),
	padding: 0,
}));

const ActionButton = styled(Button)(({ theme }) => ({
	flex: '1 1 0',
	margin: 0,
	padding: theme.spacing(3, 0),
	borderRadius: 0,
}));

export default function Recipe() {
	return (
		<DialogContent>
			<Header component="header">
				<Titles>
					<Typography variant="h4" component="h1">
						Spag Bog of Glory
					</Typography>
					<Typography variant="h6" component="h2">
						by Tessy Begg
					</Typography>
					<Tooltip title="Compliment the chef">
						<IconButton edge="start" color="favourite">
							<FavoriteBorderRounded />
						</IconButton>
					</Tooltip>
					x3
				</Titles>
				<IconActions>
					<Tooltip title="Don't be greedy">
						<IconButton>
							<ShareRounded />
						</IconButton>
					</Tooltip>
					<Tooltip title="View source">
						<IconButton>
							<OpenInNewRounded />
						</IconButton>
					</Tooltip>
					<Tooltip title="Close recipe">
						<IconButton edge="end">
							<CancelRounded />
						</IconButton>
					</Tooltip>
				</IconActions>
			</Header>
			<Image />
			<Overview>
				<Typography variant="h5" gutterBottom>
					About
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
						Ingredients
					</Typography>
					Lorem ipsum dolor amet mustache knausgaard +1, blue bottle waistcoat
					tbh semiotics artisan synth stumptown gastropub cornhole celiac swag.
					Brunch raclette vexillologist post-ironic glossier ennui XOXO mlkshk
					godard pour-over blog tumblr humblebrag. Blue bottle put a bird on it
					twee prism biodiesel brooklyn. Blue bottle ennui tbh succulents.
				</Ingredients>
				<Method>
					<Typography variant="h5" gutterBottom>
						Method
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
				<ActionButton size="large" color="inherit" startIcon={<ShareRounded />}>
					DON'T BE GREEDY
				</ActionButton>
				<ActionButton
					size="large"
					color="inherit"
					startIcon={<FavoriteBorderRounded color="favourite" edge="start" />}
				>
					COMPLIMENT THE CHEF
				</ActionButton>
				<ActionButton
					size="large"
					color="inherit"
					startIcon={<OpenInNewRounded />}
				>
					VIEW SOURCE
				</ActionButton>
			</Actions>
		</DialogContent>
	);
}
