import { styled, IconButton, Typography, Avatar } from '@mui/material';

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

export default function AppbarLogo() {
	return (
		<Wrapper>
			<StyledLink to="/">
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					sx={{ mr: 1, p: 1 }}
				>
					<Avatar
						src="https://veganise.it/images/logos/logo-icon.png"
						variant="square"
						sx={{ width: 32, height: 32, p: 0, borderRadius: 0.5 }}
					/>
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
