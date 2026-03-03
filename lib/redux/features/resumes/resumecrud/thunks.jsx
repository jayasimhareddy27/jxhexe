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


//create resume
export const createResume = createAsyncThunk(
  'resumes/resumecrud/createResume',
  async (name, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Companybackend}resume`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create resume');
      }

      const { _id } = await response.json();
      
      dispatch(displayToast({ message: `Resume "${name}" created successfully!`, type: 'success' }));
      return { _id, name };
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: 'error' }));
      return rejectWithValue(error.message);
    }
  }
);


// Make primary resume
export const makePrimaryResume = createAsyncThunk(
  'resumes/resumecrud/makePrimary',
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Companybackend}userreferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ primaryResumeId: resumeId }),
      });
      if (!response.ok) throw new Error('Failed to update primary resume');
      const data = await response.json();
      dispatch(displayToast({ message: "Primary resume updated successfully", type: "success" }));
      return resumeId;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);


export const markAIPrimaryResume = createAsyncThunk(
  'resumes/resumecrud/markAIPrimaryResume',
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Companybackend}userreferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aiResumeRef: resumeId }),
      });
      if (!response.ok) throw new Error('Failed to update primary resume');
      const data = await response.json();
      dispatch(displayToast({ message: "Primary AI resume updated successfully", type: "success" }));
      return resumeId;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);


export const markProfileResume = createAsyncThunk(
  'resumes/resumecrud/markProfileResume',
  async (resumeId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Companybackend}userreferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ myProfileRef: resumeId }), // Matches the key for Profile
      });

      if (!response.ok) throw new Error('Failed to update profile resume');
      
      const data = await response.json();
      dispatch(displayToast({ message: "Profile source updated successfully", type: "success" }));
      
      // Returns the ID to update the Redux state
      return resumeId; 
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

export const markPrimaryResumeTemplate = createAsyncThunk(
  'resumes/resumecrud/markPrimaryResumeTemplate',
  async (favResumeTemplateId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${Companybackend}userreferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favResumeTemplateId: favResumeTemplateId }), // Matches the key for Profile
      });

      if (!response.ok) throw new Error('Failed to update profile resume');
      
      const data = await response.json();
      dispatch(displayToast({ message: "Profile source updated successfully", type: "success" }));
      
      // Returns the ID to update the Redux state
      return favResumeTemplateId; 
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
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
