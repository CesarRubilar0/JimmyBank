import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

// Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, accessToken, refreshToken } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al iniciar sesión');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error al registrar usuario');
    }
  }
);

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: getInitialUser(),
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
