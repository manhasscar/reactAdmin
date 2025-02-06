import { Backdrop, CircularProgress } from '@mui/material';

const LoadingIndicator = ({ open }) => {
    return (
        <Backdrop
            sx={{
                color: '#666666',
                zIndex: (theme) => theme.zIndex.drawer + 2,
                backgroundColor: 'rgba(0, 0, 0, 0.0)'
            }}
            open={open}
        >
            <CircularProgress 
                color="inherit"
                size={60}
                thickness={5}
            />
        </Backdrop>
    );
};

export default LoadingIndicator; 