import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { 
  setCredentials as setCredentialsReducer, 
  clearCredentials as clearCredentialsReducer 
} from './reducers';

import { authExtraReducers } from './extrareducers';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: setCredentialsReducer,
    clearCredentials: clearCredentialsReducer,
  },
  extraReducers: authExtraReducers
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
