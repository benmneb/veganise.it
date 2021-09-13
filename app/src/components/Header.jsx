import { styled, Typography } from '@mui/material/';

import { HideOnScroll } from '../utils';

const Wrapper = styled('header')(({ theme }) => ({
	height: '70vh',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	position: 'relative',
	overflow: 'hidden',
}));

const BackgroundImage = styled('div')(({ theme }) => ({
	opacity: 1,
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${theme.palette.background.default} 100%), url(https://picsum.photos/720/480)`,
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	transitionProperty: 'opacity',
	transitionDuration: theme.transitions.duration.complex,
	transitionTimingFunction: theme.transitions.easing.easeInOut,
}));

const HGroup = styled('hgroup')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	textAlign: 'center',
	zIndex: '1',
	padding: theme.spacing(2),
}));

const InlineBlock = styled('span')({
	display: 'inline-block',
});

export default function Header() {
	// const [imageLoaded, setImageLoaded] = useState(false);

	// load image on pageload
	// useEffect(() => {
	// 	// const { imageSrc } = props;

	// 	const image = new Image();
	// 	image.src = 'https://picsum.photos/id/1080/720/480';

	// 	image.onload = () => {
	// 		setImageLoaded(true);
	// 	};
	// }, []);

	return (
		<Wrapper>
			<BackgroundImage />
			<HideOnScroll threshold={(15 / 100) * window.innerHeight}>
				<HGroup>
					<Typography
						variant="h1"
						sx={{ '@media (max-width: 387px)': { fontSize: '2.8rem' } }}
					>
						VEGANISE IT
					</Typography>
					<Typography
						variant="h3"
						component="h2"
						sx={{
							display: { mobile: 'none', tablet: 'block' },
						}}
					>
						<InlineBlock>🧑‍🍳 Your favourite recipes.</InlineBlock>{' '}
						<InlineBlock>Made with plants 🌱</InlineBlock>
					</Typography>
					<Typography
						variant="h3"
						component="h2"
						sx={{
							display: { mobile: 'block', tablet: 'none' },
							marginTop: 2,
							'@media (max-width: 379px)': {
								display: 'none',
							},
						}}
					>
						<InlineBlock>Your favourite recipes.</InlineBlock>{' '}
						<InlineBlock>🧑‍🍳 Made with plants 🌱</InlineBlock>
					</Typography>
				</HGroup>
			</HideOnScroll>
		</Wrapper>
	);
}
