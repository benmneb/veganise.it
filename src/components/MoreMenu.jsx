import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
	OpenInNewRounded,
	ReportGmailerrorredRounded,
} from '@mui/icons-material';

const options = [
	{ name: 'View Source', icon: <OpenInNewRounded /> },
	{ name: 'Report', icon: <ReportGmailerrorredRounded /> },
];

export default function MoreMenu(props) {
	const { open, close, anchor, recipe } = props;

	function handleMenuSelection(option) {
		if (option === 'View Source') {
			close();
			return window.open(
				`${recipe?.url}?ref=veganise.it`,
				'_blank',
				'noopener'
			);
		}

		if (option === 'Report') {
			close('report');
		}
	}

	return (
		<Menu
			id="more-menu"
			anchorEl={anchor}
			open={open}
			onClose={close}
			MenuListProps={{ 'aria-labelledby': 'more-button' }}
		>
			{options.map((option) => (
				<MenuItem
					key={option.name}
					onClick={() => handleMenuSelection(option.name)}
				>
					<ListItemIcon>{option.icon}</ListItemIcon>
					<ListItemText>{option.name}</ListItemText>
				</MenuItem>
			))}
		</Menu>
	);
}
