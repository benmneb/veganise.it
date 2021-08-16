import { styled, Typography } from '@material-ui/core/';

const Header = styled('header')({
	width: '100vw',
	height: '60vh',
	backgroundColor: 'brown',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
});

export default function HeaderComponent() {
	return (
		<Header>
			<Typography variant="h1">VEGANISE IT</Typography>
			<Typography variant="h3" component="h2">
				🧑‍🍳 Your favourite recipes. Made with plants 🌱
			</Typography>
		</Header>
	);
}
