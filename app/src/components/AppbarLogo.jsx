import { styled, IconButton, Typography } from '@material-ui/core';

import { Link } from 'react-router-dom';

const StyledLink = styled(Link)({
	flexGrow: 1,
	textDecoration: 'none',
	color: 'inherit',
});

const Wrapper = styled('div')({
	display: 'flex',
});

const Inner = styled('div')({
	userSelect: 'none',
	display: 'flex',
	alignItems: 'center',
});

const EmojiIcon = styled('div')({
	width: 24,
	height: 24,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

export default function AppbarLogo() {
	return (
		<StyledLink to="/">
			<Wrapper>
				<Inner>
					<IconButton size="large" edge="start" color="inherit" sx={{ mr: 1 }}>
						<EmojiIcon>🧑‍🍳</EmojiIcon>
					</IconButton>
					<Typography
						variant="h4"
						component="h1"
						sx={{ display: { mobile: 'none', tablet: 'block' } }}
					>
						Veganise it!
					</Typography>
				</Inner>
			</Wrapper>
		</StyledLink>
	);
}
