import { createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from '../../toast/thunks';
import { Companybackend } from '../../../../../src/globalvar/companydetails';

// read all coverletters
export const fetchCoverletters = createAsyncThunk(
  'coverletters/coverlettercrud/fetchCoverletters',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Companybackend}coverletter`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch coverletters');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


//create coverletter
export const createCoverletter = createAsyncThunk(
  'coverletters/coverlettercrud/createCoverletter',
  async (name, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Companybackend}coverletter`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create coverletter');
      }

      const { _id } = await response.json();
      
      dispatch(displayToast({ message: `Cover letter "${name}" created successfully!`, type: 'success' }));
      return { _id, name };
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);
