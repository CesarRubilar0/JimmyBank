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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ExitToApp,
  AccountBalance,
  People,
  LockOpen,
  Block,
  Search,
  Clear,
} from '@mui/icons-material';
import { fetchAdminAccounts, toggleAccountBlockStatus } from '../store/accountsSlice.js';
import { logout } from '../store/authSlice.js';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { accounts, loading, error } = useSelector((state) => state.accounts);

  // Filters state
  const [searchNumber, setSearchNumber] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const loadAccounts = () => {
    const filters = {};
    if (searchNumber.trim()) filters.accountNumber = searchNumber.trim();
    if (filterType !== 'ALL') filters.accountType = filterType;
    if (filterStatus !== 'ALL') filters.status = filterStatus.toLowerCase();
    
    dispatch(fetchAdminAccounts(filters));
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.role.startsWith('admin_')) {
      navigate('/dashboard');
    } else {
      loadAccounts();
    }
  }, [user, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadAccounts();
  };

  const handleClearFilters = () => {
    setSearchNumber('');
    setFilterType('ALL');
    setFilterStatus('ALL');
    dispatch(fetchAdminAccounts({}));
  };

  const handleToggleBlock = async (accountId, currentStatus) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    await dispatch(toggleAccountBlockStatus({ accountId, newStatus }));
    // Re-fetch to guarantee sync, although slice updates locally
    loadAccounts();
  };

  // Metrics
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalAccounts = accounts.length;
  const blockedAccountsCount = accounts.filter((acc) => acc.status === 'blocked').length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header bar */}
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
            Panel de Control Administrativo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sesión iniciada como: <strong>{user?.first_name} {user?.last_name}</strong> ({user?.role})
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<ExitToApp />}
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </Box>

      {/* Metrics Widgets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(16,185,129,0.1)', mr: 2 }}>
                <AccountBalance color="primary" sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Fondos Totales Custodiados
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  ${totalBalance.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(59,130,246,0.1)', mr: 2 }}>
                <People color="info" sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Total de Cuentas Abiertas
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {totalAccounts}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(239,68,68,0.1)', mr: 2 }}>
                <Block color="error" sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Cuentas Bloqueadas
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {blockedAccountsCount}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters form */}
      <Card sx={{ mb: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Filtros de Búsqueda
          </Typography>
          <Box component="form" onSubmit={handleFilterSubmit} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="Número de Cuenta"
              variant="outlined"
              size="small"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="type-select-label">Tipo</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select"
                value={filterType}
                label="Tipo"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="VISTA">VISTA</MenuItem>
                <MenuItem value="AHORRO">AHORRO</MenuItem>
                <MenuItem value="CORRIENTE">CORRIENTE</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="status-select-label">Estado</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={filterStatus}
                label="Estado"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="ACTIVE">Activas</MenuItem>
                <MenuItem value="BLOCKED">Bloqueadas</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" type="submit" startIcon={<Search />}>
              Buscar
            </Button>
            <Button variant="outlined" color="inherit" onClick={handleClearFilters} startIcon={<Clear />}>
              Limpiar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Main Table list */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Número de Cuenta</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>DNI/RUT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tipo de Cuenta</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Saldo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : accounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      No se encontraron cuentas con los filtros actuales.
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts.map((account) => {
                    const isBlocked = account.status === 'blocked';
                    return (
                      <TableRow key={account.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {account.account_number}
                        </TableCell>
                        <TableCell>
                          {account.user
                            ? `${account.user.first_name} ${account.user.last_name}`
                            : 'N/A'}
                          <Typography variant="caption" display="block" color="text.secondary">
                            {account.user?.email}
                          </Typography>
                        </TableCell>
                        <TableCell>{account.user?.dni || 'N/A'}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          ${account.balance.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </TableCell>
                        <TableCell>
                          {isBlocked ? (
                            <Chip label="Bloqueada" color="error" size="small" />
                          ) : (
                            <Chip label="Activa" color="success" size="small" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {isBlocked ? (
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              startIcon={<LockOpen />}
                              onClick={() => handleToggleBlock(account.id, account.status)}
                            >
                              Desbloquear
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Block />}
                              onClick={() => handleToggleBlock(account.id, account.status)}
                            >
                              Bloquear
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
