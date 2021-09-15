import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
	Facebook,
	Twitter,
	Reddit,
	Pinterest,
	LinkedIn,
	ContentCopy,
} from '@mui/icons-material';

import { showSnackbar } from '../state';

const options = [
	{ name: 'Facebook', icon: <Facebook sx={{ color: '#4267B2' }} /> },
	{ name: 'Reddit', icon: <Reddit sx={{ color: '#ff4500' }} /> },
	{ name: 'Twitter', icon: <Twitter sx={{ color: '#1da1f2' }} /> },
	{ name: 'Pinterest', icon: <Pinterest sx={{ color: '#bd081c' }} /> },
	{ name: 'LinkedIn', icon: <LinkedIn sx={{ color: '#2867b2' }} /> },
	{ name: 'Copy Link', icon: <ContentCopy /> },
];

export default function ShareMenu(props) {
	const { open, close, anchor } = props;

	const { id } = useParams();
	const dispatch = useDispatch();
	const searchResults = useSelector((state) => state.searchResults);
	const currentRecipe = searchResults?.data.find((recipe) => recipe._id === id);

	const url = window.location.href;
	const msg = 'Check%20out%20this%20vegan%20recipe!%20%F0%9F%A4%A4';
	const img = currentRecipe?.image || '';

	async function copyLink() {
		if (navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(url);
				dispatch(
					showSnackbar({
						message: 'Link copied to clipboard',
						severity: 'info',
					})
				);
			} catch (error) {
				dispatch(
					showSnackbar({
						message: 'Could not copy to clipboard. Sorry!',
						severity: 'error',
					})
				);
				console.error('Error copying to clipboard:', error.message);
			}
		} else {
			dispatch(
				showSnackbar({
					message: 'Could not access clipboard API. Sorry!',
					severity: 'error',
				})
			);
			console.error('Could not access Clipboard API');
		}
	}

	function handleShare(site) {
		switch (site) {
			case 'Facebook':
				return window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${url}`,
					'_blank',
					'noopener noreferrer'
				);
			case 'Reddit':
				return window.open(
					`https://reddit.com/submit?url=${url}&title=${msg}`,
					'_blank',
					'noopener noreferrer'
				);
			case 'Twitter':
				return window.open(
					`https://twitter.com/intent/tweet?url=${url}&text=${msg}`,
					'_blank',
					'noopener noreferrer'
				);
			case 'Pinterest':
				return window.open(
					`https://pinterest.com/pin/create/button/?url=${url}&media=${img}&description=${msg}`,
					'_blank',
					'noopener noreferrer'
				);
			case 'LinkedIn':
				return window.open(
					`https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
					'_blank',
					'noopener noreferrer'
				);
			case 'Copy Link':
				copyLink();
				return;
			default:
				return null;
		}
	}

	return (
		<Menu
			id="share-menu"
			anchorEl={anchor}
			open={open}
			onClose={close}
			MenuListProps={{ 'aria-labelledby': 'share-button' }}
		>
			{options.map((option) => (
				<MenuItem
					key={option.name}
					onClick={() => {
						handleShare(option.name);
						return close();
					}}
				>
					<ListItemIcon>{option.icon}</ListItemIcon>
					<ListItemText>{option.name}</ListItemText>
				</MenuItem>
			))}
		</Menu>
	);
}
