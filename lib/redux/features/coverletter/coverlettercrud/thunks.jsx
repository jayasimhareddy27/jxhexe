import { createAsyncThunk } from '@reduxjs/toolkit';
import { displayToast } from '../../toast/thunks';
import { BackendURL } from '../../../../utils';


// read all coverletters
export const fetchCoverletters = createAsyncThunk(
  'coverletters/coverlettercrud/fetchCoverletters',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BackendURL}/api/coverletter`, {
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
      const response = await fetch(`${BackendURL}/api/coverletter`, {
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

// delete coverletter
export const deleteCoverletter = createAsyncThunk(
  'coverletters/coverlettercrud/deleteCoverletter',
  async (coverletterId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BackendURL}/api/coverletter/${coverletterId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete coverletter');
      dispatch(displayToast({ message: "Cover letter deleted successfully", type: "success" }));
      return coverletterId;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);


// Copy/create coverletter
export const copyCoverletter = createAsyncThunk(
  'coverletters/coverlettercrud/copyCoverletter',
  async ({ coverletterId, newName }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BackendURL}/api/coverletter/copy`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coverletterId, newName }),
      });
      if (!response.ok) throw new Error('Failed to copy coverletter');
      const data = await response.json();
      dispatch(displayToast({ message: `Copied to "${newName}" successfully`, type: "success" }));
      return data.newCoverletter;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);


// mark primary Coverletter template

export const markPrimaryCoverletterTemplate = createAsyncThunk(
  'coverletters/coverlettercrud/markPrimaryCoverletterTemplate',
  async (favCoverletterTemplateId, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BackendURL}/api/userreferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favCoverletterTemplateId: favCoverletterTemplateId }), // Matches the key for Profile
      });

      if (!response.ok) throw new Error('Failed to update profile coverletter template');
      
      const data = await response.json();
      dispatch(displayToast({ message: "Profile coverletter template updated successfully", type: "success" }));
      
      // Returns the ID to update the Redux state
      return favCoverletterTemplateId; 
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);


