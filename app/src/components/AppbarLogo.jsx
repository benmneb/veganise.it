import { styled, IconButton, Typography } from '@material-ui/core';

import { Link } from 'react-router-dom';

const StyledLink = styled(Link)({
	textDecoration: 'none',
	color: 'inherit',
	display: 'flex',
	alignItems: 'center',
});

const Wrapper = styled('div')({
	display: 'flex',
	flexGrow: 1,
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
		<Wrapper>
			<StyledLink to="/">
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
			</StyledLink>
		</Wrapper>
	);
}
