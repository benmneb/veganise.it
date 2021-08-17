import { styled } from '@material-ui/core';
import { ResultCard } from './index';

const Grid = styled('section')(({ theme }) => ({
	width: '100%',
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
	gridGap: theme.spacing(6),
	[theme.breakpoints.only('mobile')]: {
		gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
	},
	userSelect: 'none',
}));

export default function Results() {
	return (
		<Grid>
			{[...Array(8)].map((_, i) => (
				<ResultCard key={i} />
			))}
		</Grid>
	);
}
