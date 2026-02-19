import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import {
  showToast as showToastReducer, 
  hideToast as hideToastReducer
} from './reducers';

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: showToastReducer,
    hideToast: hideToastReducer,
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;