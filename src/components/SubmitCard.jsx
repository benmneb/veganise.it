import {
	styled,
	Button,
	Card as MuiCard,
	CardContent,
	Typography,
} from '@mui/material';

import { useHistory, useLocation } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
	width: '100%',
	maxWidth: 700,
	height: 400,
	placeSelf: 'center',
	position: 'relative',
	transition: `${theme.transitions.duration.complex}ms`,
	'&:focus-visible': {
		transform: 'translateY(-2px)',
		boxShadow:
			'0 16px 24px 0 rgba(0, 0, 0, 0.12), 0 4px 20px 0 rgba(61, 71, 82, 0.1), 0 0 0 5px rgba(0, 127, 255, 0.5)',
		outline: 'none',
	},
}));

const Content = styled(CardContent)({
	height: '100%',
	textAlign: 'center',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
});

export default function SubmitCard() {
	const history = useHistory();
	const location = useLocation();

	function handleClick() {
		return history.push({
			pathname: `/submit`,
			state: { background: location },
		});
	}

	return (
		<Card elevation={0} component="article">
			<Content>
				<Typography
					variant="h5"
					component="h1"
					fontWeight="bold"
					marginBottom={4}
				>
					That's it!
				</Typography>
				<div>
					<Typography
						variant="h6"
						component="h2"
						color="text.secondary"
						paragraph
					>
						Want your recipes featured here?
					</Typography>
					<Button
						variant="contained"
						size="large"
						color="secondary"
						disableElevation
						onClick={handleClick}
						sx={{ typography: 'h6' }}
					>
						Yes please!
					</Button>
				</div>
			</Content>
		</Card>
	);
}
