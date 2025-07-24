import { createTheme } from '@mui/material/styles';

// Paleta de colores común
const commonPalette = {
  primary: {
    main: '#3498db',
    light: '#d6eaf8',
    dark: '#1d6fa5',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#2ecc71',
  },
};

// Paleta para modo claro
const lightPalette = {
  ...commonPalette,
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
  },
  header: {
    bg: '#3498db',
    text: '#ffffff',
    shadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
    border: 'rgba(255, 255, 255, 0.3)',
    notification: {
      bg: 'rgba(245, 247, 250, 0.95)',
      text: '#2c3e50',
      time: '#7f8c8d',
    }
  },
  dashboard: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
    borderTop: '#3498db',
  }
};

// Paleta para modo oscuro
const darkPalette = {
  ...commonPalette,
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#e0e0e0',
    secondary: '#9e9e9e',
  },
  header: {
    bg: '#1a2a3a',
    text: '#e0e1dd',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    border: 'rgba(255, 255, 255, 0.1)',
    notification: {
      bg: 'rgba(21, 38, 66, 0.9)',
      text: '#e0f7fa',
      time: '#a9b4c2',
    }
  },
  dashboard: {
    background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
    borderTop: '#1d6fa5',
  }
};

// Crear temas basados en las paletas
export const lightTheme = createTheme({
  palette: lightPalette,
  typography: {
    fontFamily: [
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif'
    ].join(','),
    h4: { fontWeight: 700, fontSize: '1.75rem' },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: { root: { transition: 'all 0.3s ease' } }
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.header.bg,
          color: theme.palette.header.text,
          boxShadow: theme.palette.header.shadow,
          borderBottom: `1px solid ${theme.palette.header.border}`,
          zIndex: 1200,
          transition: 'background-color 0.3s ease',
        })
      }
    }
  }
});

export const darkTheme = createTheme({
  palette: darkPalette,
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  components: lightTheme.components
});