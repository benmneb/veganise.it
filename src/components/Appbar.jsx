import { styled } from '@mui/material/styles';
import { AppBar, Toolbar } from '@mui/material';

import { AppbarLogo, AppbarSearch } from './index';
import { ScrollTrigger } from '../utils';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
	padding: theme.spacing(2),
}));

export default function Appbar() {
	return (
		<ScrollTrigger threshold={10} transition="slide">
			<AppBar position="sticky" color="inherit" sx={{ px: 1 }}>
				<StyledToolbar>
					<AppbarLogo />
					<AppbarSearch />
				</StyledToolbar>
			</AppBar>
		</ScrollTrigger>
	);
}
