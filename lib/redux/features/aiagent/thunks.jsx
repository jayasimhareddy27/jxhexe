import { api_Gemini, api_HuggingFaceai, api_Ollama } from './utils';
import {createAsyncThunk} from '@reduxjs/toolkit';
// --- ASYNC THUNK ---

export const connectAiAgent = createAsyncThunk(
  'aiAgent/connect',
  async (config, { rejectWithValue }) => {
    try {
      const { provider, model, ApiKey } = config;
      const prompt = 'return integer only: 2+2=?';
      let response;

      if (provider === 'Gemini') {
        response = await api_Gemini(prompt, model, ApiKey);
        if (!response) throw new Error('Connection failed. Check API key.');
      } else if (provider === 'HuggingFace') {
        response = await api_HuggingFaceai(prompt, model, ApiKey);
        if (response != 4) throw new Error('API returned no response. Check model or key.');
      } else if (provider === 'Ollama') {
        response = await api_Ollama(prompt, ApiKey, model);
        if (!response) throw new Error('No response from local Ollama server.');
      } else {
        throw new Error('Unsupported AI provider.');
      }
      
      // If successful, return the config to be saved in the state
      return config;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
