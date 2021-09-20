import { Component } from 'react';

import { Fade, Modal, Backdrop, IconButton, styled } from '@mui/material';
import CircularProgress, {
	circularProgressClasses,
} from '@mui/material/CircularProgress';
import { CloseRounded } from '@mui/icons-material';

// jacked w/ ❤️ from https://github.com/Ngineer101/react-image-video-lightbox
// (i simplified it and added MUI)

const VideoWrapper = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	width: '100%',
	height: '100%',
	padding: 72,
	maxWidth: 1000,
	[theme.breakpoints.only('mobile')]: {
		padding: 0,
	},
}));

// UTILS

const settle = (val, target, range) => {
	const lowerRange = val > target - range && val < target;
	const upperRange = val < target + range && val > target;
	return lowerRange || upperRange ? target : val;
};

const getPointFromTouch = (touch) => {
	return {
		x: touch.clientX,
		y: touch.clientY,
	};
};

const getDistanceBetweenPoints = (pointA, pointB) => {
	return Math.sqrt(
		Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2)
	);
};

const between = (min, max, value) => {
	return Math.min(max, Math.max(min, value));
};

// LIGHTBOX

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SETTLE_RANGE = 0.001;
const ADDITIONAL_LIMIT = 0.2;
const DOUBLE_TAP_THRESHOLD = 300;
const ANIMATION_SPEED = 0.04;
const RESET_ANIMATION_SPEED = 0.08;
const INITIAL_X = 0;
const INITIAL_Y = 0;
const INITIAL_SCALE = 1;
const MOBILE_ICON_SIZE = 35;
const DESKTOP_ICON_SIZE = 50;

export default class Lightbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			x: INITIAL_X,
			y: INITIAL_Y,
			scale: INITIAL_SCALE,
			width: window.innerWidth,
			height: window.innerHeight,
			index: this.props.startIndex,
			swiping: false,
			loading: true,
			iconSize: window.innerWidth <= 500 ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE,
		};

		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.onNavigationCallback =
			this.props.onNavigationCallback &&
			typeof this.props.onNavigationCallback === 'function'
				? this.props.onNavigationCallback
				: () => {};
	}

	zoomTo(scale) {
		const frame = () => {
			if (this.state.scale === scale) return;

			const distance = scale - this.state.scale;
			const targetScale = this.state.scale + ANIMATION_SPEED * distance;

			this.zoom(settle(targetScale, scale, SETTLE_RANGE));
			this.animation = requestAnimationFrame(frame);
		};

		this.animation = requestAnimationFrame(frame);
	}

	reset() {
		const frame = () => {
			if (
				this.state.scale === INITIAL_SCALE &&
				this.state.x === INITIAL_X &&
				this.state.y === INITIAL_Y
			)
				return;

			const scaleDelta = INITIAL_SCALE - this.state.scale;
			const targetScale = settle(
				this.state.scale + RESET_ANIMATION_SPEED * scaleDelta,
				INITIAL_SCALE,
				SETTLE_RANGE
			);

			const nextWidth = this.width * targetScale;
			const nextHeight = this.height * targetScale;

			this.setState(
				{
					scale: targetScale,
					width: nextWidth,
					height: nextHeight,
					x: INITIAL_X,
					y: INITIAL_Y,
				},
				() => {
					this.animation = requestAnimationFrame(frame);
				}
			);
		};

		this.animation = requestAnimationFrame(frame);
	}

	handleTouchStart(event) {
		this.animation && cancelAnimationFrame(this.animation);
		if (event.touches.length === 2) this.handlePinchStart(event);
		if (event.touches.length === 1) this.handleTapStart(event);
	}

	handleTouchMove(event) {
		if (event.touches.length === 2) this.handlePinchMove(event);
		if (event.touches.length === 1) this.handlePanMove(event);
	}

	handleTouchEnd(event) {
		if (event.touches.length > 0) return null;

		if (this.state.scale > MAX_SCALE) return this.zoomTo(MAX_SCALE);
		if (this.state.scale < MIN_SCALE) return this.zoomTo(MIN_SCALE);

		if (
			this.lastTouchEnd &&
			this.lastTouchEnd + DOUBLE_TAP_THRESHOLD > event.timeStamp
		) {
			this.reset();
		}

		if (this.state.swiping && this.state.scale === 1) {
			this.handleSwipe(event);
		}

		this.lastTouchEnd = event.timeStamp;
	}

	handleSwipe(event) {
		let swipeDelta = event.changedTouches[0].clientX - this.swipeStartX;
		if (swipeDelta < -(this.width / 3)) {
			this.swipeRight();
		} else if (swipeDelta > this.width / 3) {
			this.swipeLeft();
		} else {
			this.reset();
		}
	}

	swipeLeft() {
		let currentIndex = this.state.index;
		if (currentIndex > 0) {
			setTimeout(() => {
				this.setState(
					{
						index: currentIndex - 1,
						swiping: false,
						x: INITIAL_X,
						loading: true,
					},
					() => this.onNavigationCallback(currentIndex - 1)
				);
			}, 500);
		} else {
			this.reset();
		}
	}

	swipeRight() {
		let currentIndex = this.state.index;
		if (currentIndex < this.props.data.length - 1) {
			setTimeout(() => {
				this.setState(
					{
						index: currentIndex + 1,
						swiping: false,
						x: INITIAL_X,
						loading: true,
					},
					() => this.onNavigationCallback(currentIndex + 1)
				);
			}, 500);
		} else {
			this.reset();
		}
	}

	handleTapStart(event) {
		this.swipeStartX = event.touches[0].clientX;
		this.swipeStartY = event.touches[0].clientY;
		if (this.state.scale === 1) {
			this.setState({
				swiping: true,
			});
		}
	}

	handlePanMove(event) {
		if (this.state.scale === 1) {
			this.setState({
				x: event.touches[0].clientX - this.swipeStartX,
			});
		} else {
			event.preventDefault();
			this.setState({
				x: event.touches[0].clientX - this.swipeStartX,
				y: event.touches[0].clientY - this.swipeStartY,
			});
		}
	}

	handlePinchStart(event) {
		const pointA = getPointFromTouch(event.touches[0]);
		const pointB = getPointFromTouch(event.touches[1]);
		this.lastDistance = getDistanceBetweenPoints(pointA, pointB);
	}

	handlePinchMove(event) {
		event.preventDefault();
		const pointA = getPointFromTouch(event.touches[0]);
		const pointB = getPointFromTouch(event.touches[1]);
		const distance = getDistanceBetweenPoints(pointA, pointB);
		const scale = between(
			MIN_SCALE - ADDITIONAL_LIMIT,
			MAX_SCALE + ADDITIONAL_LIMIT,
			this.state.scale * (distance / this.lastDistance)
		);
		this.zoom(scale);
		this.lastDistance = distance;
	}

	zoom(scale) {
		const nextWidth = this.width * scale;
		const nextHeight = this.height * scale;

		this.setState({
			width: nextWidth,
			height: nextHeight,
			scale,
		});
	}

	getMedia() {
		const data = this.props.data;

		if (data.type === 'image') {
			return (
				<img
					alt={data.altTag}
					src={data.url}
					style={{
						pointerEvents: this.state.scale === 1 ? 'auto' : 'none',
						maxWidth: '100%',
						maxHeight: '100%',
						transform: `translate(${this.state.x}px, ${this.state.y}px) scale(${this.state.scale})`,
						transition: 'transform 0.5s ease-out',
						cursor: 'zoom-out',
						borderRadius: 16,
					}}
					onLoad={() => {
						this.setState({ loading: false });
					}}
					onClick={this.props.handleClose}
				/>
			);
		}

		if (data.type === 'video') {
			return (
				<VideoWrapper>
					<div
						style={{
							position: 'relative',
							width: '100%',
							height: 0,
							paddingBottom: '56.25%',
						}}
					>
						<iframe
							width="560"
							height="315"
							src={data.url}
							frameBorder="0"
							allow="autoplay; encrypted-media"
							title={data.title}
							allowFullScreen
							style={{
								pointerEvents: this.state.scale === 1 ? 'auto' : 'none',
								maxWidth: '100%',
								maxHeight: '100%',
								transform: `translate(${this.state.x}px, ${this.state.y}px)`,
								transition: 'transform 0.5s ease-out',
								cursor: 'default',
								borderRadius: 16,
								// responsiveness ⬇️
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
							}}
							onLoad={() => {
								this.setState({ loading: false });
							}}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>
				</VideoWrapper>
			);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', () => {
			if (window.innerWidth <= 500) {
				this.setState({ iconSize: MOBILE_ICON_SIZE });
			} else {
				this.setState({ iconSize: DESKTOP_ICON_SIZE });
			}
		});
	}

	render() {
		const media = this.getMedia();

		return (
			<Modal
				open={this.props.open}
				onClose={this.props.handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={this.props.open}>
					<div
						onTouchStart={this.handleTouchStart}
						onTouchMove={this.handleTouchMove}
						onTouchEnd={this.handleTouchEnd}
						onClick={this.props.handleClose}
						style={{
							top: '0px',
							left: '0px',
							overflow: 'hidden',
							position: 'fixed',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'row',
							height: '100%',
							width: '100%',
							backgroundColor: 'rgba(0,0,0,.74)',
							cursor: 'zoom-out',
						}}
					>
						<IconButton
							size="large"
							onClick={this.props.handleClose}
							sx={{
								position: 'absolute',
								top: 16,
								right: 16,
								color: 'grey.200',
							}}
						>
							<CloseRounded fontSize="large" color="inherit" />
						</IconButton>

						<Fade in={this.state.loading}>
							<div style={{ margin: 'auto', position: 'fixed' }}>
								<CircularProgress
									variant="determinate"
									sx={{ color: 'grey.200' }}
									size={100}
									thickness={8}
									value={100}
								/>
								<CircularProgress
									variant="indeterminate"
									disableShrink
									sx={{
										color: 'secondary.main',
										animationDuration: '550ms',
										position: 'absolute',
										left: 0,
										[`& .${circularProgressClasses.circle}`]: {
											strokeLinecap: 'round',
										},
									}}
									size={100}
									thickness={8}
								/>
							</div>
						</Fade>
						{media}
					</div>
				</Fade>
			</Modal>
		);
	}
}
