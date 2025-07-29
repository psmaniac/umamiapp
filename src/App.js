import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import DashboardMenu from './components/DashboardMenu';
import Header from './Header';
import Login from './Login';
import Users from './components/Users';
import ProductsMenu from './components/ProductsMenu';
import Orders from './components/Orders';
import Billing from './components/Billing';
import Warehouse from './components/Warehouse';
import Accounting from './components/Accounting';
import Settings from './components/Settings';
import Breadcrumbs from './components/Breadcrumbs';
import { lightTheme, darkTheme } from './theme';
import { AuthProvider, useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Layout principal con Header y Breadcrumbs condicional
function MainLayout({ darkMode, toggleDarkMode }) {
  const location = useLocation();
  const showBreadcrumbs = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      {showBreadcrumbs && <Breadcrumbs />}
      <Outlet />
    </>
  );
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
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <Routes>
                  <Route element={<MainLayout darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />}>
                    <Route index element={<DashboardMenu />} />
                    <Route path="users" element={<Users />} />
                    <Route path="products" element={<ProductsMenu />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="warehouse" element={<Warehouse />} />
                    <Route path="accounting" element={<Accounting />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </ProtectedRoute>
            }
          />
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