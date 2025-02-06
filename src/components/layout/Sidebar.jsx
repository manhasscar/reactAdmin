import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, useTheme, useMediaQuery, styled, Collapse, ListItemButton } from '@mui/material';
import { Menu as MenuIcon, Dashboard, AccountBalance, Person, Settings, ExpandLess, ExpandMore, Payment, History, Group, ManageAccounts } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const [menuStates, setMenuStates] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();

    const menuItems = [
        { 
            text: '대시보드', 
            icon: <Dashboard />, 
            path: '/',
        },
        { 
            text: '입출금관리', 
            icon: <AccountBalance />, 
            subMenus: [
                { text: '입출금 내역', icon: <History />, path: '/transactions' },
                { text: '입출금 신청', icon: <Payment />, path: '/deposit-requests' },
            ]
        },
        { 
            text: '회원관리', 
            icon: <Person />, 
            subMenus: [
                { text: '회원 목록', icon: <Group />, path: '/users' }
            ]
        },
        { 
            text: '설정', 
            icon: <Settings />, 
            path: '/settings',
        },
    ];

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleMenuClick = (text) => {
        setMenuStates(prev => ({
            ...prev,
            [text]: !prev[text]
        }));
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const renderMenuItem = (item) => {
        const hasSubMenus = item.subMenus && item.subMenus.length > 0;
        const isMenuOpen = menuStates[item.text];
        const active = hasSubMenus 
            ? item.subMenus.some(subMenu => isActive(subMenu.path))
            : isActive(item.path);

        return (
            <div key={item.text}>
                <ListItemButton
                    onClick={() => hasSubMenus ? handleMenuClick(item.text) : null}
                    component={hasSubMenus ? 'div' : Link}
                    to={hasSubMenus ? undefined : item.path}
                    sx={{
                        backgroundColor: active ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        },
                    }}
                >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {hasSubMenus && (isMenuOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                
                {hasSubMenus && (
                    <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.subMenus.map((subMenu) => (
                                <ListItemButton
                                    key={subMenu.text}
                                    component={Link}
                                    to={subMenu.path}
                                    onClick={isMobile ? toggleDrawer : undefined}
                                    sx={{ 
                                        pl: 4,
                                        backgroundColor: isActive(subMenu.path) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                        },
                                    }}
                                >
                                    <ListItemIcon>{subMenu.icon}</ListItemIcon>
                                    <ListItemText primary={subMenu.text} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                )}
            </div>
        );
    };

    const drawerContent = (
        <>
            <DrawerHeader>
                <IconButton onClick={toggleDrawer}>
                    <MenuIcon />
                </IconButton>
            </DrawerHeader>
            <List>
                {menuItems.map(renderMenuItem)}
            </List>
        </>
    );

    return (
        <>
            <IconButton 
                color="inherit" 
                aria-label="open drawer" 
                edge="start" 
                onClick={toggleDrawer} 
                sx={{ mr: 2, display: { sm: 'none' } }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isMobile ? open : true}
                onClose={toggleDrawer}
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;
