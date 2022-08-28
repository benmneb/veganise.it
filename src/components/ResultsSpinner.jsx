import { styled } from '@mui/material';
import CircularProgress, {
	circularProgressClasses,
} from '@mui/material/CircularProgress';

const Wrapper = styled('aside')(({ theme }) => ({
	margin: theme.spacing(12.5, 0, 8.5),
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

export default function Spinner(props) {
	const { show } = props;

	if (!show) return null;

	return (
		<Wrapper>
			<div style={{ position: 'absolute' }}>
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
		</Wrapper>
	);
}
