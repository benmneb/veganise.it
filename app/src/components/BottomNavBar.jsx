import { styled, Button, Paper, useMediaQuery } from '@mui/material';
import { ArrowBackIosRounded, HighlightOffRounded } from '@mui/icons-material';

import { LikeButton } from './index';

const StyledPaper = styled(Paper)(({ theme }) => ({
	width: '100%',
	position: 'fixed',
	bottom: 0,
	left: 0,
	right: 0,
	borderRadius: '16px 16px 0 0',
	backgroundColor: theme.palette.background.paper,
	display: 'flex',
	justifyContent: 'stretch',
}));

const StyledButton = styled(Button)(({ theme }) => ({
	flexGrow: 0,
	width: 200,
	maxWidth: '40%',
	height: '100%',
	padding: theme.spacing(3, 0),
	borderRadius: '16px 0 0 0',
	color: theme.palette.text.primary,
	backgroundColor: theme.palette.background.paper,
	borderRight: `1px solid ${theme.palette.grey[300]}`,
}));

export default function BottomNavBar(props) {
	const { onClick, children, background } = props;

	const tinyPhone = useMediaQuery('(max-width: 347px)');

	return (
		<StyledPaper elevation={10}>
			<StyledButton
				size="large"
				startIcon={
					background ? (
						<ArrowBackIosRounded color="action" />
					) : (
						<HighlightOffRounded color="action" />
					)
				}
				onClick={onClick}
			>
				{children}
			</StyledButton>
			<LikeButton>Compliment {!tinyPhone && 'the chef'}</LikeButton>
		</StyledPaper>
	);
}
