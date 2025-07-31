import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  styled, 
  useTheme,
  InputAdornment,
  IconButton,
  Fade
} from '@mui/material';
import { 
  Lock as LockIcon, 
  Person as PersonIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo.js';

const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: theme.palette.dashboard.background,
  padding: theme.spacing(3),
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 450,
  width: '100%',
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[10],
  background: theme.palette.background.paper,
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background: theme.palette.primary.main,
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  '& svg': {
    fontSize: 70,
    color: theme.palette.primary.main,
  }
}));

const LoginForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  fontWeight: 600,
  fontSize: '1.1rem',
  letterSpacing: '0.5px',
  borderRadius: theme.shape.borderRadius * 2,
}));

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Credenciales incorrectas. Usuario: admin, Contraseña: 123');
      }
    } catch (err) {
      setError('Error en la autenticación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <Fade in timeout={500}>
        <LoginPaper elevation={6}>
          <LogoContainer>
            <LockIcon />
            <Logo />
            <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
              Panel Administrativo
            </Typography>
          </LogoContainer>
          
          <LoginForm onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Usuario"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
              }}
              disabled={isSubmitting}
              autoFocus
            />
            
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              disabled={isSubmitting}
            />
            
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            
            <SubmitButton
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || !username || !password}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </SubmitButton>
            
            <Typography variant="body2" sx={{ 
              mt: 3, 
              textAlign: 'center', 
              color: theme.palette.text.secondary,
              fontStyle: 'italic'
            }}>
              Usa admin / 123 para acceder
            </Typography>
          </LoginForm>
        </LoginPaper>
      </Fade>
    </LoginContainer>
  );
};

export default Login;