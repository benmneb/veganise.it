import { styled, Typography, useMediaQuery } from '@mui/material/';

import { ScrollTrigger } from '../utils';

import Image from 'mui-image';

const Wrapper = styled('header')({
	height: '70vh',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	position: 'relative',
	overflow: 'hidden',
});

const Gradient = styled('div')(({ theme }) => ({
	zIndex: 1,
	position: 'absolute',
	bottom: 0,
	left: 0,
	width: '100%',
	height: '70%',
	backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.825) 70%, ${theme.palette.background.default} 100%)`,
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
}));

const HGroup = styled('hgroup')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',
	zIndex: '1',
	padding: theme.spacing(2),
	marginTop: theme.spacing(-4),
	'& h1': {
		textShadow: '0px 0px 5px #fff, 0px 0px 10px #fefefe',
	},
	'& h2': {
		textShadow: '0px 0px 5px #fff',
	},
}));

const random = Math.ceil(Math.random() * 12); // There are 12 pictures.

export default function Header() {
	const tablet = useMediaQuery((theme) => theme.breakpoints.down('tablet'));
	const hd = useMediaQuery((theme) => theme.breakpoints.down('hd'));

	const width = tablet ? '1280' : hd ? '2560' : '3840';

	return (
		<Wrapper>
			<Gradient />
			<Image
				src={`${window.location.origin}/images/heros/${width}xAUTO/${random}.jpg`}
				position="absolute"
				shift="bottom"
				wrapperStyle={{ position: 'absolute' }}
			/>
			<ScrollTrigger threshold={(15 / 100) * window.innerHeight}>
				<HGroup>
					<Typography
						variant="h1"
						sx={{
							marginBottom: 2,
							marginTop: -2,
							'@media (max-width: 387px)': { fontSize: '2.8rem' },
						}}
					>
						VEGANISE IT
					</Typography>
					<Typography
						variant="h3"
						component="h2"
						sx={{
							display: { mobile: 'none', tablet: 'block' },
							'@media (max-width: 850px)': { display: 'none' },
						}}
					>
						🧑‍🍳 Your favourite recipes. Made with plants 🌱
					</Typography>
					<Typography
						variant="h3"
						component="h2"
						sx={{
							display: 'none',
							'@media (min-width: 387px) and (max-width: 850px)': {
								display: 'block',
							},
						}}
					>
						Your favourite recipes.
						<br />
						🧑‍🍳 Made with plants 🌱
					</Typography>
				</HGroup>
			</ScrollTrigger>
		</Wrapper>
	);
}
