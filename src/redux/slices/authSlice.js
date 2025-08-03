
// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    registerUser: (_, action) => {
      const { email, password } = action.payload;
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
});

export const { loginSuccess, logout, registerUser } = authSlice.actions;
export default authSlice.reducer;