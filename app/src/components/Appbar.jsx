import * as React from 'react';
import { styled, alpha } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { HideOnScroll } from '../utils';

const Search = styled('div')(({ theme }) => ({
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

export default function Appbar() {
	return (
		<HideOnScroll threshold={10} transition="slide">
			<AppBar position="sticky" color="inherit" sx={{ px: 1 }}>
				<Toolbar>
					<IconButton size="large" edge="start" color="inherit" sx={{ mr: 1 }}>
						🧑‍🍳
					</IconButton>
					<Typography
						variant="h4"
						component="h1"
						sx={{ flexGrow: 1, display: { mobile: 'none', tablet: 'block' } }}
					>
						Veganise it!
					</Typography>
					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Search 5000+ vegan recipes..."
							inputProps={{ 'aria-label': 'search' }}
						/>
					</Search>
				</Toolbar>
			</AppBar>
		</HideOnScroll>
	);
}
