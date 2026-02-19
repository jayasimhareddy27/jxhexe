import {initialState} from './state';
import { createSlice } from '@reduxjs/toolkit';
import { resumecrudExtraReducers } from './extrareducers';

const resumecrudSlice = createSlice({
  name: 'resumecrud',
  initialState,
  reducers: {
    clearResumeError: (state) => {
    state.error = null;
  },
    hydrateResumes: (state, action) => {
      if (action.payload) {
      state.allResumes = action.payload.allResumes || [];
      state.favResumeTemplateId = action.payload.favResumeTemplateId || "template01";
      state.primaryResumeId = action.payload.primaryResumeId || null;
      state.aiResumeRef = action.payload.aiResumeRef || null;
      state.myProfileRef = action.payload.myProfileRef || null;
    }
  }
  },
  extraReducers: resumecrudExtraReducers,

});
export const { 
  clearResumeError,
  hydrateResumes  
} = resumecrudSlice.actions;
export default resumecrudSlice.reducer;