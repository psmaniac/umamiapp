import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Snackbar, 
  Alert,
  styled
} from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& .MuiTypography-root': {
    fontWeight: 700,
    color: theme.palette.primary.main,
  }
}));

const Settings = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Simular carga de datos existentes
  useEffect(() => {
    // En una aplicación real, aquí cargarías los datos desde una API o almacenamiento local
    const savedSettings = {
      name: 'UmamiApp Restaurant',
      address: '123 Calle Ficticia, Ciudad Imaginaria',
      email: 'contacto@umamirestaurant.com',
      phone: '+123 456 7890',
    };
    setRestaurantName(savedSettings.name);
    setAddress(savedSettings.address);
    setEmail(savedSettings.email);
    setPhone(savedSettings.phone);
  }, []);

  const handleSaveSettings = () => {
    // Aquí iría la lógica para guardar los datos (ej. enviar a una API)
    console.log('Guardando configuración:', { restaurantName, address, email, phone });
    setSnackbarMessage('Configuración guardada exitosamente!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <StyledPaper>
      <Header>
        <Typography variant="h5">Configuración del Restaurante</Typography>
      </Header>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nombre del Restaurante"
            fullWidth
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Dirección"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Correo Electrónico de Contacto"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Teléfono de Contacto"
            fullWidth
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            onClick={handleSaveSettings} 
            sx={{ mt: 2 }}
          >
            Guardar Configuración
          </Button>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledPaper>
  );
};

export default Settings;