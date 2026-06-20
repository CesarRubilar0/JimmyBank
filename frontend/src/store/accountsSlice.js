import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

// Thunks
export const fetchMyAccounts = createAsyncThunk(
  'accounts/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/accounts/my');
      return response.data.accounts;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener tus cuentas');
    }
  }
);

export const fetchAdminAccounts = createAsyncThunk(
  'accounts/fetchAdmin',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/accounts/all', { params: filters });
      return response.data.accounts;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al obtener el listado de cuentas');
    }
  }
);

export const createBankAccount = createAsyncThunk(
  'accounts/create',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await api.post('/accounts', accountData);
      return response.data.account;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al crear la cuenta');
    }
  }
);

export const toggleAccountBlockStatus = createAsyncThunk(
  'accounts/toggleBlock',
  async ({ accountId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/accounts/${accountId}/block`, { status: newStatus });
      return response.data.account;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al actualizar estado de cuenta');
    }
  }
);

const initialState = {
  accounts: [],
  loading: false,
  error: null,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearAccountsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Accounts
      .addCase(fetchMyAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchMyAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Admin Accounts
      .addCase(fetchAdminAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAdminAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Account
      .addCase(createBankAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBankAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.unshift(action.payload);
      })
      .addCase(createBankAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Block Status
      .addCase(toggleAccountBlockStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.accounts.findIndex((acc) => acc.id === updated.id);
        if (index !== -1) {
          // Preserve User object if present (loaded in admin view)
          const existingUser = state.accounts[index].user;
          state.accounts[index] = { ...updated, user: existingUser };
        }
      });
  },
});

export const { clearAccountsError } = accountsSlice.actions;
export default accountsSlice.reducer;
