import {createAsyncThunk} from '@reduxjs/toolkit';
import { toggleTheme } from './slice';

export const toggleAndSaveTheme = createAsyncThunk(
  'theme/toggleAndSave',
  async (_, { dispatch, getState, rejectWithValue }) => {
    // Instantly update the UI by dispatching the pure reducer first.
    dispatch(toggleTheme());

    // Get the new theme and the user's token from the global state.
    const { theme } = getState().theme;
    const { token } = getState().auth;

    // If the user isn't logged in, we don't need to save to the database.
    if (!token) return;

    // Save the new theme preference to the database.
    try {
      await fetch('/api/userreferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme }),
      });
    } catch (error) {
      // If saving fails, we can optionally dispatch another action to show a toast.
      return rejectWithValue('Failed to save theme preference.');
    }
  }
);
