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
  CircularProgress,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import { registerUser, clearError } from '../store/authSlice.js';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    dni: '',
    phone: '',
    address: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, first_name, last_name, dni } = formData;
    if (!email || !password || !first_name || !last_name || !dni) {
      return;
    }
    dispatch(registerUser(formData));
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
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
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <IconButton
              color="primary"
              sx={{
                mb: 1,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                p: 2,
                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
              }}
            >
              <AccountBalance sx={{ fontSize: 35 }} />
            </IconButton>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
              Crea tu Cuenta Bancaria
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Regístrate para abrir cuentas digitales, consultar saldos y gestionar tus finanzas.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="first_name"
                  label="Nombre"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="last_name"
                  label="Apellido"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="dni"
                  label="RUT o DNI"
                  id="dni"
                  value={formData.dni}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Teléfono"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label="Correo Electrónico"
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña (mínimo 6 caracteres)"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Dirección"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                mt: 4,
                mb: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
