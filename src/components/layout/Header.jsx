import { AppBar, Toolbar, Typography, styled, Box, Button } from '@mui/material';
import { getToken, removeToken } from '../../utils/auth';
import CONFIG from '../../config/config';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
}));

const Header = () => {
    const adminLevel = getToken('adminLevel');
    const adminLevelName = CONFIG.ADMIN_LEVEL[adminLevel];
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    return (
        <StyledAppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    어드민 대시보드
                </Typography>
                <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" noWrap component="div">
                        {adminLevelName} {getToken('adminName')}
                    </Typography>
                    <Button variant="contained" color="error" onClick={handleLogout}>
                        로그아웃
                    </Button>
                </Box>
                
            </Toolbar>
        </StyledAppBar>
    );
};

export default Header;
