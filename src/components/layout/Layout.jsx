import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = {
    xs: 150,
    sm: 158,
    md: 166
};

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex',
                height: '100%',
                width: '100%',
        }}>
            <CssBaseline />
            <Header />
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { 
                        xs: `calc(100dvw - ${SIDEBAR_WIDTH}px)`,
                        sm: `calc(100dvw - ${SIDEBAR_WIDTH}px)`,
                        md: `calc(100dvw - ${SIDEBAR_WIDTH}px)`
                    },
                    height: { 
                        xs: `calc(100dvh - ${HEADER_HEIGHT.xs}px)`,
                        sm: `calc(100dvh - ${HEADER_HEIGHT.sm}px)`,
                        md: `calc(100dvh - ${HEADER_HEIGHT.md}px)`
                    },
                    mt: ['48px', '56px', '64px'],
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
