import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  styled, 
  useMediaQuery,
  Box
} from '@mui/material';
import {
  People as UsersIcon,
  ShoppingCart as OrdersIcon,
  Receipt as BillingIcon,
  Inventory as WarehouseIcon,
  Fastfood as ProductsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';

// Animación fadeIn
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DashboardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '50vh',
  background: theme.palette.dashboard.background,
  padding: theme.spacing(0.5),
  boxSizing: 'border-box',
}));

const DashboardContent = styled('div')(({ theme }) => ({
  maxWidth: 1200,
  width: '100%',
  padding: theme.spacing(3.75),
  animation: `${fadeIn} 0.8s ease`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.875),
  },
}));

const MenuItem = styled(Paper)(({ theme }) => ({
  textDecoration: 'none', // Para quitar el subrayado de los enlaces
  display: 'block', // Para que el enlace ocupe todo el espacio
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid transparent',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(52, 152, 219, 0.15)' 
      : 'rgba(52, 152, 219, 0.1)',
    border: `1px solid ${theme.palette.mode === 'dark' 
      ? 'rgba(52, 152, 219, 0.3)' 
      : 'rgba(52, 152, 219, 0.2)'}`,
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .menu-text': {
      color: theme.palette.primary.dark,
      fontWeight: 600,
    }
  },
}));

const MenuIconContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 70,
  height: 70,
  minWidth: 70,
  minHeight: 70,
  borderRadius: '50%',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(52, 152, 219, 0.1)' 
    : 'rgba(52, 152, 219, 0.1)',
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(52, 152, 219, 0.2)' 
    : 'rgba(52, 152, 219, 0.2)'}`,
  transition: 'all 0.3s ease',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    width: 55,
    height: 55,
    minWidth: 55,
    minHeight: 55,
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(52, 152, 219, 0.2)' 
      : 'rgba(52, 152, 219, 0.2)',
    transform: 'scale(1.1)',
  },
}));

const MenuTextContainer = styled('div')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1.5),
  textAlign: 'center',
}));

const DashboardMenu = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  
  const menuItems = [
    { id: 1, name: 'Usuarios', icon: <UsersIcon />, path: '/users' },
    { id: 2, name: 'Pedidos', icon: <OrdersIcon />, path: '/orders' },
    { id: 3, name: 'Facturación', icon: <BillingIcon />, path: '/billing' },
    { id: 4, name: 'Almacenes', icon: <WarehouseIcon />, path: '/warehouse' },
    { id: 5, name: 'Productos', icon: <ProductsIcon />, path: '/products' }, 
    { id: 6, name: 'Configuración', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <DashboardContainer>
      <DashboardContent>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={({ palette, breakpoints }) => ({ 
            color: palette.primary.main,
            mb: 4,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            position: 'relative',
            paddingBottom: '15px',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: palette.primary.main,
              borderRadius: '2px',
            },
            [breakpoints.down('sm')]: {
              fontSize: '1.5rem',
            }
          })}
        >
          Panel de Control
        </Typography>
        
         <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          width: '100%'
        }}>
          <Grid 
            container 
            spacing={isSmallScreen ? 2 : 4} 
            justifyContent="center"
            alignItems="center"
            sx={{ 
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            {menuItems.map((item) => (
              <Grid item xs={6} sm={4} md={4} key={item.id} sx={{
                  aspectRatio: '1/1',
                  maxWidth: isSmallScreen ? 140 : 180,
                  minWidth: isSmallScreen ? 140 : 180,
                  margin: '0 auto',
                }}>
                <MenuItem
                  component={Link}
                  to={item.path}
                  elevation={3}
                >
                  <MenuIconContainer>
                    {React.cloneElement(item.icon, {
                      sx: ({ palette }) => ({ 
                        fontSize: 40,
                        color: palette.primary.main 
                      })
                    })}
                  </MenuIconContainer>
                  <MenuTextContainer>
                    <Typography 
                      variant={isSmallScreen ? "subtitle1" : "h6"} 
                      className="menu-text"
                      sx={({ palette }) => ({ 
                        color: palette.text.primary,
                        fontWeight: 500,
                        textAlign: 'center'
                      })}
                    >
                      {item.name}
                    </Typography>
                  </MenuTextContainer>
                </MenuItem>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default DashboardMenu;