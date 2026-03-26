import { api_Gemini, api_HuggingFaceai,api_Ollama, } from '../../../../public/components/ai/llmapi';
import {createAsyncThunk} from '@reduxjs/toolkit';
import { Companybackend } from '../../../../src/globalvar/companydetails';
import { aiManager } from '../../../../public/components/ai/chromeaimanager';

// --- ASYNC THUNK ---

export const connectAiAgent = createAsyncThunk(
  'aiAgent/connect',
  async (config, { rejectWithValue }) => {
    try {
      const { provider, model, ApiKey, isExisting } = config; // Added isExisting
      
      const prompt = 'return integer only: 2+2=?';
      let response;
      
      if (provider === 'ChromeAI') {
        try {
          const model = await aiManager.getModel({ temperature: 0.5, topK: 40 });
          const response = await model.invoke(prompt);
          if (!response) throw new Error("Connection failed");
          if (response != 4) throw new Error('Connection failed.');
        } catch (e) {
          await aiManager.dispose();
          throw e;
        }
      }
      else if (provider === 'Gemini') {
        response = await api_Gemini(prompt, model, ApiKey);
        if (response != 4) throw new Error('Connection failed. Check API key.');
      } 
      else if (provider === 'HuggingFace') {
        response = await api_HuggingFaceai(prompt, model, ApiKey);
        if (response != 4) throw new Error('API returned no response. Check model or key.');
      } 
      else if (provider === 'Ollama') {
        response = await api_Ollama(prompt, ApiKey, model);
        if (response != 4) throw new Error('No response from local Ollama server.');
      } 
      else {
        throw new Error('Unsupported AI provider.');
      }
      
      // 2. Conditional Backend Sync
      // Only sync if it's NOT ChromeAI AND it's NOT an existing key
      if (provider !== 'ChromeAI' && !isExisting) {
        const token = localStorage.getItem('token');
        const syncResponse = await fetch(`${Companybackend}userreferences`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            newAiKey: { agent: model, provider, apiKey: ApiKey } 
          })
        });

        if (!syncResponse.ok) {
          console.warn("AI connection verified but failed to sync to profile.");
        }
      }

      // 3. Return config to update Redux state
      return config;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);