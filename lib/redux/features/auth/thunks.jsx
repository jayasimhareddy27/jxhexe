
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Companybackend } from '../../../../src/globalvar/companydetails';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${Companybackend}auth/login`, {  method: 'POST',  headers: { 'Content-Type': 'application/json' },  body: JSON.stringify(formData),});
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
