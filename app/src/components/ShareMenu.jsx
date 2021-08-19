import { Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
	Facebook,
	Twitter,
	Pinterest,
	LinkedIn,
	ContentCopy,
} from '@material-ui/icons';

const url = window.location.href;
const img = 'todo';

const options = [
	{ name: 'Facebook', icon: <Facebook sx={{ color: '#4267B2' }} /> },
	{ name: 'Twitter', icon: <Twitter sx={{ color: '#1da1f2' }} /> },
	{ name: 'Pinterest', icon: <Pinterest sx={{ color: '#bd081c' }} /> },
	{ name: 'LinkedIn', icon: <LinkedIn sx={{ color: '#2867b2' }} /> },
	{ name: 'Copy Link', icon: <ContentCopy /> },
];

async function copyLink() {
	if (navigator.clipboard) {
		try {
			await navigator.clipboard.writeText(url);
			console.log('Copied to clipboard:', url);
		} catch (error) {
			console.error('Error copying to clipboard:', error.message);
		}
	} else {
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
		case 'Twitter':
			return window.open(
				`https://twitter.com/intent/tweet?url=${url}&text=Check%20out%20this%20vegan%20recipe!%20%F0%9F%A4%A4`,
				'_blank',
				'noopener noreferrer'
			);
		case 'Pinterest':
			return window.open(
				`https://pinterest.com/pin/create/button/?url=${url}&media=${img}&description=Check%20out%20this%20vegan%20recipe!%20%F0%9F%A4%A4`,
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

export default function ShareMenu(props) {
	const { open, close, anchor } = props;

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
