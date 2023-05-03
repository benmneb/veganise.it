import { useState } from 'react';

import {
	CopyrightRounded,
	GitHub,
	MailOutlineRounded,
} from '@mui/icons-material';

import { Box, IconButton, Tooltip, styled } from '@mui/material';

import { ContactModal } from './index';

const Root = styled('section')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(2, 2, 1, 2),
	[theme.breakpoints.only('xs')]: {
		marginBottom: theme.mixins.toolbar.minHeight,
	},
}));

export default function Contact() {
	const [isContacting, setIsContacting] = useState(false);

	return (
		<>
			<Root>
				<Box display="flex" justifyContent="space-around">
					<Tooltip title="Contact" placement="left">
						<IconButton onClick={() => setIsContacting(true)}>
							<MailOutlineRounded fontSize="large" sx={{ color: 'black' }} />
						</IconButton>
					</Tooltip>
					<Tooltip title="License" placement="top">
						<IconButton
							rel="license noopener noreferrer"
							href="http://creativecommons.org/licenses/by-nc/4.0/"
							target="_blank"
						>
							<CopyrightRounded fontSize="large" sx={{ color: 'black' }} />
						</IconButton>
					</Tooltip>
					<Tooltip title="View source" placement="right">
						<IconButton
							href="https://github.com/benmneb/veganise-it"
							target="_blank"
							rel="noopener"
						>
							<GitHub fontSize="large" sx={{ color: 'black' }} />
						</IconButton>
					</Tooltip>
				</Box>
			</Root>
			<ContactModal open={isContacting} close={() => setIsContacting(false)} />
		</>
	);
}
