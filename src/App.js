import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import DashboardMenu from './components/layout/DashboardMenu.js';
import Header from './components/layout/Header.js';
import Login from './pages/LoginPage.js';
import Users from './features/users/Users.js';
import Products from './features/products/Products.js';
import Orders from './features/orders/Orders.js';
import Billing from './features/billing/Billing.js';
import Warehouse from './features/warehouse/Warehouse.js';
import Accounting from './features/accounting/Accounting.js';
import Settings from './features/settings/Settings.js';
import Breadcrumbs from './components/common/Breadcrumbs.js';
import { lightTheme, darkTheme } from './styles/theme.js';
import { AuthProvider, useAuth } from './context/AuthContext.js';

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
                    <Route path="products/*" element={<Products />} />
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