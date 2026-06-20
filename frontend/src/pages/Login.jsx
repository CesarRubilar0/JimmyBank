import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff, AccountBalance } from '@mui/icons-material';
import { loginUser, clearError } from '../store/authSlice.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // If already logged in, redirect based on role
    if (user) {
      if (user.role.startsWith('admin_')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 4,
            background: 'linear-gradient(145deg, #111827 0%, #0b0f19 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <IconButton
              color="primary"
              sx={{
                mb: 2,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                p: 2,
                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
              }}
            >
              <AccountBalance sx={{ fontSize: 40 }} />
            </IconButton>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
              JimmyBank
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa tus credenciales para acceder a tu portal
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                mb: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes una cuenta bancaria?{' '}
                <Link to="/register" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
