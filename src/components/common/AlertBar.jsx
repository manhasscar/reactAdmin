import { Snackbar, Alert } from '@mui/material';

const AlertBar = ({ alertOpen, handleAlertClose, message, type }) => {
    return (
        <Snackbar 
            open={alertOpen} 
            autoHideDuration={2000} 
            onClose={handleAlertClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert 
                onClose={handleAlertClose} 
                severity={type} 
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AlertBar;