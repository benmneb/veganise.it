import { useState, useEffect, forwardRef } from 'react';

import { styled, Typography } from '@material-ui/core/';

import handleViewport from 'react-in-viewport';

const Header = styled('header')(({ theme }) => ({
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
	backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 38%, ${theme.palette.background.default} 100%), url(https://picsum.photos/720/480)`,
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center',
	backgroundSize: 'cover',
	transitionProperty: 'opacity',
	transitionDuration: theme.transitions.duration.complex,
	transitionTimingFunction: theme.transitions.easing.easeInOut,
}));

const HGroup = styled('hgroup')(({ theme }) => ({
	textAlign: 'center',
}));

const Component = forwardRef((props, ref) => {
	const { inView } = props;

	const [offset, setOffset] = useState(0);

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

	// create parallax effect
	useEffect(() => {
		if (!inView) {
			window.removeEventListener('scroll', handleScroll);
			return;
		}

		function handleScroll() {
			setOffset(window.pageYOffset);
		}

		window.addEventListener('scroll', handleScroll, {
			passive: true,
			once: true,
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [offset, inView]);

	return (
		<Header ref={ref}>
			<BackgroundImage />
			<HGroup
				sx={{
					transform: `translateY(${offset * 0.55}px)`,
					opacity: `${1 - offset / 400}`,
				}}
			>
				<Typography variant="h1">VEGANISE IT</Typography>
				<Typography variant="h3" component="h2">
					🧑‍🍳 Your favourite recipes. Made with plants 🌱
				</Typography>
			</HGroup>
		</Header>
	);
});

const HeaderComponent = handleViewport((props) => {
	const { inViewport, forwardedRef } = props;

	return <Component ref={forwardedRef} inView={inViewport} />;
});

export default HeaderComponent;
