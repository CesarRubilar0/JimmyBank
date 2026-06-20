import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import store from './store/index.js';
import theme from './theme.js';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('accessToken');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If client tries to access admin routes, redirect to customer dashboard
    if (user.role === 'client') {
      return <Navigate to="/dashboard" replace />;
    }
    // If admin tries to access customer routes, redirect to admin dashboard
    if (user.role.startsWith('admin_')) {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

// Root redirect handler
const RootRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('accessToken');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role.startsWith('admin_')) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Client Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin_general', 'admin_accounts', 'admin_cuentas']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallbacks */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
