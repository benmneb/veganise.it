import { styled, Typography } from '@material-ui/core';

const Wrapper = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	textAlign: 'center',
	marginBottom: theme.spacing(5),
	'& h3': {
		maxWidth: 1000,
	},
}));

export default function Caption(props) {
	const { children } = props;

	return (
		<Wrapper>
			<Typography variant="h4" component="h3">
				{children}
			</Typography>
		</Wrapper>
	);
}
