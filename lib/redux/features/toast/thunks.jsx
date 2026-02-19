import {createAsyncThunk} from '@reduxjs/toolkit';
import { hideToast,showToast } from './slice';

// --- ASYNC THUNK ---

// This is an async thunk that shows a toast and then hides it after a delay.
export const displayToast = createAsyncThunk(
  'toast/displayToast',
  async (payload, { dispatch }) => {
    dispatch(showToast(payload));
    await new Promise(resolve => setTimeout(resolve, 4000));
    return dispatch(hideToast());
  }
);
