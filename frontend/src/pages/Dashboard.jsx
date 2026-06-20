import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  Lock,
  ExitToApp,
  AccountBox,
  TrendingUp,
  ArrowForward,
  TrendingDown,
  Refresh,
} from '@mui/icons-material';
import { fetchMyAccounts, createBankAccount, clearAccountsError } from '../store/accountsSlice.js';
import { logout } from '../store/authSlice.js';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { accounts, loading, error } = useSelector((state) => state.accounts);
  
  const [openModal, setOpenModal] = useState(false);
  const [accountType, setAccountType] = useState('VISTA');
  const [initialDeposit, setInitialDeposit] = useState('0');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role.startsWith('admin_')) {
      navigate('/admin');
    } else {
      dispatch(fetchMyAccounts());
    }
  }, [user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    dispatch(clearAccountsError());
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setAccountType('VISTA');
    setInitialDeposit('0');
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const depositNum = parseFloat(initialDeposit);
    if (isNaN(depositNum) || depositNum < 0) return;
    
    const result = await dispatch(createBankAccount({
      account_type: accountType,
      initial_deposit: depositNum,
    }));
    
    if (createBankAccount.fulfilled.match(result)) {
      handleCloseModal();
    }
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + (curr.status === 'active' ? curr.balance : 0), 0);

  // Mocked recent transactions for premium dashboard visual experience
  const mockTransactions = [
    { id: 1, desc: 'Depósito Inicial', type: 'deposit', amount: 500, date: 'Hoy, 14:32' },
    { id: 2, desc: 'Transferencia Recibida - Luis M.', type: 'deposit', amount: 120, date: 'Ayer, 09:15' },
    { id: 3, desc: 'Retiro Cajero Automático', type: 'withdrawal', amount: -60, date: '18 Jun, 19:40' },
    { id: 4, desc: 'Compra Supermercado Líder', type: 'withdrawal', amount: -45.5, date: '17 Jun, 12:10' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            Hola, {user?.first_name} {user?.last_name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido a tu banca digital digital.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Refresh />}
            onClick={() => dispatch(fetchMyAccounts())}
          >
            Sincronizar
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
          >
            Salir
          </Button>
        </Box>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={4}>
        {/* Net Worth & Summary card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)',
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <AccountBalanceWallet sx={{ fontSize: 32, opacity: 0.8 }} />
                <Chip
                  label="Cliente Activo"
                  color="success"
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.7, textTransform: 'uppercase', tracking: '0.1em' }}>
                Patrimonio Total Estimado
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>
                ${totalBalance.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Suma de saldos en tus cuentas activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Action / Accounts opener */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Mis Cuentas Bancarias
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  onClick={handleOpenModal}
                >
                  Abrir Nueva Cuenta
                </Button>
              </Box>

              {loading && accounts.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : accounts.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Aún no tienes cuentas abiertas. Haz clic en "Abrir Nueva Cuenta" para comenzar.
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {accounts.map((account) => {
                    const isBlocked = account.status === 'blocked';
                    return (
                      <Grid item xs={12} sm={6} key={account.id}>
                        <Card
                          sx={{
                            p: 1,
                            backgroundColor: '#1f2937',
                            border: isBlocked ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                N° {account.account_number}
                              </Typography>
                              <Chip
                                label={account.account_type}
                                size="small"
                                color={
                                  account.account_type === 'VISTA'
                                    ? 'warning'
                                    : account.account_type === 'AHORRO'
                                    ? 'success'
                                    : 'primary'
                                }
                                variant="outlined"
                              />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                              ${account.balance.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Creada el: {new Date(account.created_at || account.createdAt).toLocaleDateString()}
                              </Typography>
                              {isBlocked ? (
                                <Chip icon={<Lock style={{ fontSize: 14 }} />} label="Bloqueada" color="error" size="small" />
                              ) : (
                                <Chip label="Activa" color="success" size="small" variant="light" />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Transactions ledger section */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Movimientos Recientes (Demostración)
              </Typography>
              <List>
                {mockTransactions.map((tx, idx) => (
                  <React.Fragment key={tx.id}>
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        {tx.type === 'deposit' ? (
                          <TrendingUp color="success" sx={{ fontSize: 28 }} />
                        ) : (
                          <TrendingDown color="error" sx={{ fontSize: 28 }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={tx.desc}
                        secondary={tx.date}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          color: tx.type === 'deposit' ? 'success.main' : 'error.main',
                        }}
                      >
                        {tx.type === 'deposit' ? '+' : ''}${tx.amount.toLocaleString('es-CL')}
                      </Typography>
                    </ListItem>
                    {idx < mockTransactions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Account Creation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Abrir Nueva Cuenta Digital</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="account-type-label">Tipo de Cuenta</InputLabel>
              <Select
                labelId="account-type-label"
                id="account-type"
                value={accountType}
                label="Tipo de Cuenta"
                onChange={(e) => setAccountType(e.target.value)}
              >
                <MenuItem value="VISTA">Cuenta Vista (Fácil y Rápida)</MenuItem>
                <MenuItem value="AHORRO">Cuenta de Ahorro (Intereses de Crecimiento)</MenuItem>
                <MenuItem value="CORRIENTE">Cuenta Corriente (Línea de Crédito)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Depósito Inicial ($)"
              type="number"
              fullWidth
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              helperText="Monto inicial para fondear la cuenta al momento de abrirla."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleCreateAccount} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirmar Apertura'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
