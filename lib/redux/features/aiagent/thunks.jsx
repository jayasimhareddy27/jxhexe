import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChromeAI } from "@langchain/community/experimental/llms/chrome_ai";

// --- ASYNC THUNK ---

export const connectAiAgent = createAsyncThunk(
  'aiAgent/connect',
  async (_, { rejectWithValue }) => {
    try {
      const model = new ChromeAI({  temperature: 0.5,  topK: 40,});

      const testResponse = await model.invoke('return the number 4 only');
      if (!testResponse) {
        throw new Error('Local AI via LangChain failed to respond.');
      }
      
      return { status: 'connected', model: 'Gemini Nano' };
      
    } catch (error) {
      // Catch specific LangChain or Browser errors
      return rejectWithValue(error.message);
    }
  }
);