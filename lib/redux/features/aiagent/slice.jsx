import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { authExtraReducers } from './extrareducers';

const aiAgentSlice = createSlice({
  name: 'aiAgent',
  initialState,
  reducers: {
    // Manual reset if needed
    resetStatus: (state) => {
      state.isReady = false;
      state.error = null;
      state.loading = 'idle';
    }
  },
  extraReducers: authExtraReducers,
});

export const { resetStatus } = aiAgentSlice.actions;
export default aiAgentSlice.reducer;