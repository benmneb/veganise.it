import { styled } from '@material-ui/core';
import { Search, Results, Header, Caption } from './index';

const Main = styled('main')(({ theme }) => ({
	margin: theme.spacing(4),
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
}));

export default function Home() {
	return (
		<>
			<Header />
			<Main>
				<Search />
				<Caption>
					A curated collection of mouth-watering recipes to help you cook the
					best plant-based meals easier than ever.
				</Caption>
				<Results />
			</Main>
		</>
	);
}
