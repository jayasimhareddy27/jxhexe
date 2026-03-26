
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { 
  setAgent as setAgentReducer, 
  clearAgent as clearAgentReducer
} from './reducers';
import { authExtraReducers } from './extrareducers';


const aiAgentSlice = createSlice({
  name: 'aiAgent',
  initialState,
  reducers: {
    setAgent: setAgentReducer,
    clearAgent: clearAgentReducer,
  },
  extraReducers: authExtraReducers,
});

export const { setAgent, clearAgent } = aiAgentSlice.actions;
export default aiAgentSlice.reducer;