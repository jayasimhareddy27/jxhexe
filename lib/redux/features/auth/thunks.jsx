
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BackendURL } from '../../../utils';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${BackendURL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Login failed.');
      localStorage.setItem('theme', data.references.theme  );
      window.location.reload();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BackendURL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed.');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAccount = createAsyncThunk(
  'auth/updateAccount',
  async (data, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update account.');
      return result.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);