import { createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from '../../toast/thunks';
import { Companybackend } from '../../../../../src/globalvar/companydetails';

// read all resumes
export const fetchResumes = createAsyncThunk(
  'resumes/resumecrud/fetchResumes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${Companybackend}resume`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch resumes');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Fetch user references
export const returnuseReference = createAsyncThunk(
  'resumes/resumecrud/returnuseReference',
  async (token, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${Companybackend}userreferences/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user references');
      const data = await response.json();
      return data;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);
