import { useMediaQuery } from '@mui/material';
import { ShareRounded, IosShareRounded } from '@mui/icons-material';

const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);

export default function ShareIcon(props) {
	const { children, others } = props;

	const probablyMobileDevice = useMediaQuery('@media (hover: none)');

	if (isApple && probablyMobileDevice) {
		return <IosShareRounded {...others}>{children}</IosShareRounded>;
	}

	return <ShareRounded {...others}>{children}</ShareRounded>;
}
