import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Menu, 
  MenuItem,
  Avatar,
  Divider,
  Typography,
  Box,
  ListItemIcon,
  ListItemText,
  Badge,
  styled
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.js';
import Logo from '../common/Logo.js';

// Componentes estilizados
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 3),
  minHeight: '70px !important',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
    minHeight: '60px !important',
  },
}));

const HeaderRightSection = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
  },
}));

const NotificationsHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.75, 2),
  background: theme.palette.header?.notification?.bg,
  borderRadius: '12px 12px 0 0',
}));

const NotificationsTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  color: theme.palette.header?.notification?.text,
}));

const NotificationsCount = styled('div')(({ theme }) => ({
  background: '#4db6ac',
  color: 'white',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 12,
  fontWeight: 700,
  fontSize: '0.8rem',
}));

const NotificationItem = styled(MenuItem)(({ theme }) => ({
  minWidth: 320,
  padding: theme.spacing(1.75, 2),
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(30, 58, 95, 0.6)' 
      : 'rgba(200, 230, 255, 0.6)',
  },
}));

const NotificationText = styled('div')(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(0.75),
  fontSize: '0.95rem',
  color: theme.palette.header?.notification?.text,
}));

const NotificationTime = styled('div')(({ theme }) => ({
  color: theme.palette.header?.notification?.time,
  fontSize: '0.85rem',
}));

const ViewAllItem = styled(MenuItem)(({ theme }) => ({
  justifyContent: 'center',
  padding: theme.spacing(1.5, 0),
  background: theme.palette.header?.notification?.bg,
  borderRadius: '0 0 12px 12px',
}));

const ViewAllText = styled('div')(({ theme }) => ({
  color: '#4db6ac',
  fontWeight: 600,
}));

const UserInfoItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  cursor: 'default',
  background: theme.palette.header?.notification?.bg,
  borderRadius: '12px 12px 0 0',
}));

const UserName = styled('div')(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.05rem',
  color: theme.palette.header?.notification?.text,
}));

const UserEmail = styled('div')(({ theme }) => ({
  color: theme.palette.header?.notification?.time,
  fontSize: '0.9rem',
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(30, 58, 95, 0.6)' 
      : 'rgba(200, 230, 255, 0.6)',
    '& .MuiListItemIcon-root': {
      color: '#4db6ac',
      transform: 'scale(1.1)',
    },
    '& .MuiTypography-root': {
      color: '#4db6ac',
      fontWeight: 600,
    }
  },
}));

const MenuIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '36px !important',
  color: theme.palette.header?.notification?.time,
  fontSize: '1.3rem',
  transition: 'all 0.2s ease',
}));

const MenuText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    color: theme.palette.header?.notification?.text,
    fontWeight: 500,
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
  },
}));

// Componente Header
const Header = ({ darkMode, toggleDarkMode }) => {
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationsOpen = (event) => setNotificationsAnchorEl(event.currentTarget);
  const handleNotificationsClose = () => setNotificationsAnchorEl(null);

  const notifications = [
    { id: 1, text: 'Nuevo pedido recibido', time: 'Hace 10 min' },
    { id: 2, text: 'Pedido #4582 enviado', time: 'Hace 2 horas' },
    { id: 3, text: 'Actualización de menú completada', time: 'Ayer' },
  ];

  const menuProps = {
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transformOrigin: { vertical: 'top', horizontal: 'right' },
    onClose: handleNotificationsClose,
  };

  const userMenuProps = {
    ...menuProps,
    onClose: handleMenuClose,
  };

  return (
    <AppBar position="static">
      <StyledToolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo />
        </Box>
        
        <HeaderRightSection>
          <IconButton 
            color="inherit" 
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={handleNotificationsOpen}
            aria-label="notificaciones"
            disabled={!isAuthenticated}
          >
            <Badge badgeContent={isAuthenticated ? 3 : 0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="cuenta del usuario"
            aria-controls="user-menu"
            aria-haspopup="true"
            disabled={!isAuthenticated}
          >
            <Avatar 
              alt="Usuario Admin" 
              sx={{ 
                bgcolor: '#4db6ac', 
                width: 38, 
                height: 38, 
                fontSize: '1rem' 
              }}
            >
              AU
            </Avatar>
          </IconButton>
        </HeaderRightSection>
      </StyledToolbar>
      
      {isAuthenticated && (
        <>
          <Menu
            {...menuProps}
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            PaperProps={{
              sx: {
                maxWidth: 'min(90vw, 350px)',
                overflow: 'visible',
                paddingTop: '0 !important',
                paddingBottom: '0 !important',
                '& .MuiList-root': { 
                  paddingTop: '0 !important',
                  paddingBottom: '0 !important' 
                }
              }
            }}
          >
            <NotificationsHeader>
              <RestaurantIcon sx={{ 
                color: '#4db6ac', 
                mr: 1.25, 
                fontSize: '1.4rem' 
              }} />
              <NotificationsTitle>Notificaciones</NotificationsTitle>
              <NotificationsCount>3 nuevas</NotificationsCount>
            </NotificationsHeader>
            <Divider />
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {notifications.map(({id, text, time}) => (
                <NotificationItem key={id} onClick={handleNotificationsClose}>
                  <Box>
                    <NotificationText>{text}</NotificationText>
                    <NotificationTime>{time}</NotificationTime>
                  </Box>
                </NotificationItem>
              ))}
            </Box>
            <Divider />
            <ViewAllItem>
              <ViewAllText>Ver todas las notificaciones</ViewAllText>
            </ViewAllItem>
          </Menu>
          
          <Menu
            {...userMenuProps}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            PaperProps={{ 
              sx: {
                maxWidth: 'min(90vw, 350px)',
                overflow: 'visible',
                paddingTop: '0 !important',
                paddingBottom: '0 !important',
                '& .MuiList-root': { 
                  paddingTop: '0 !important',
                  paddingBottom: '0 !important' 
                }
              }
            }}
          >
            <UserInfoItem>
              <Avatar 
                alt="Usuario Admin" 
                sx={{ 
                  bgcolor: '#4db6ac', 
                  width: 48, 
                  height: 48, 
                  fontSize: '1.2rem' 
                }}
              >
                AU
              </Avatar>
              <Box sx={{ ml: 1.5 }}>
                <UserName>Admin User</UserName>
                <UserEmail>admin@umamiapp.com</UserEmail>
              </Box>
            </UserInfoItem>
            <Divider />
            <StyledMenuItem onClick={handleMenuClose}>
              <MenuIcon>
                <AccountCircleIcon fontSize="medium" />
              </MenuIcon>
              <MenuText primary="Mi perfil" />
            </StyledMenuItem>
            <StyledMenuItem onClick={handleMenuClose}>
              <MenuIcon>
                <SettingsIcon fontSize="medium" />
              </MenuIcon>
              <MenuText primary="Configuración" />
            </StyledMenuItem>
            <Divider />
            <StyledMenuItem onClick={() => { handleMenuClose(); logout(); }}>
              <MenuIcon>
                <LogoutIcon fontSize="medium" />
              </MenuIcon>
              <MenuText primary="Cerrar sesión" />
            </StyledMenuItem>
          </Menu>
        </>
      )}
    </AppBar>
  );
};

export default Header;