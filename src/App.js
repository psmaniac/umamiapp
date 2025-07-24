import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardMenu from './components/DashboardMenu';
import Header from './Header';
import Login from './Login';
import Users from './components/Users';
import ProductsMenu from './components/ProductsMenu';
import { lightTheme, darkTheme } from './theme';
import { AuthProvider, useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const [darkMode, setDarkMode] = React.useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
                <DashboardMenu />
              </>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <>
                <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
                <Users />
              </>
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <>
                <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
                <ProductsMenu />
              </>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;