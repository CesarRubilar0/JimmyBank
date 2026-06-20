import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import accountsReducer from './accountsSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
  },
});

export default store;
