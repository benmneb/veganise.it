import { styled, Typography } from '@material-ui/core';
import { Search } from './index';

const Main = styled('main')(({ theme }) => ({
	margin: theme.spacing(4),
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
}));

const Caption = styled('div')({
	textAlign: 'center',
	maxWidth: 1000,
});

export default function Home() {
	return (
		<Main>
			<Search />
			<Caption>
				<Typography variant="h4" component="h3">
					A curated collection of mouth-watering recipes to help you cook the
					best plant-based meals easier than ever.
				</Typography>
			</Caption>
		</Main>
	);
}
