import { styled, alpha } from '@mui/material/styles';
import { AppBar, InputBase, Toolbar } from '@mui/material';
import { Search } from '@mui/icons-material';

import { AppbarLogo } from './index';
import { HideOnScroll } from '../utils';

const SearchBox = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.black, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.black, 0.25),
	},
	marginLeft: 0,
	'& .MuiInputBase-root': {
		width: '100%',
	},
	width: '100%',
	[theme.breakpoints.up('tablet')]: {
		marginLeft: theme.spacing(1),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('tablet')]: {
			width: '24ch',
			'&:focus': {
				width: '27ch',
			},
		},
	},
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
	padding: theme.spacing(2),
}));

export default function Appbar() {
	return (
		<HideOnScroll threshold={10} transition="slide">
			<AppBar position="sticky" color="inherit" sx={{ px: 1 }}>
				<StyledToolbar>
					<AppbarLogo />
					<SearchBox>
						<SearchIconWrapper>
							<Search />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search 5000+ vegan recipes..."
							inputProps={{ 'aria-label': 'search' }}
						/>
					</SearchBox>
				</StyledToolbar>
			</AppBar>
		</HideOnScroll>
	);
}
