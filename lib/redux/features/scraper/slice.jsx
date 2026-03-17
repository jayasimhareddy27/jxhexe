import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";

const scraperSlice = createSlice({
  name: "scraper",
  initialState,
  reducers: {
    updateJobData: (state, action) => {
      state.jobData = { ...state.jobData, ...action.payload };
    },
    
    setExtractionState: (state, action) => {
      const { isExtracting, isLazyLoading, flashDeepData, hasScraped } = action.payload;
      if (isExtracting !== undefined) state.isExtracting = isExtracting;
      if (isLazyLoading !== undefined) state.isLazyLoading = isLazyLoading;
      if (flashDeepData !== undefined) state.flashDeepData = flashDeepData;
      if (hasScraped !== undefined) state.hasScraped = hasScraped;
    },
    
    // Tab-Specific AI Loading States
    setIsTailoringResume: (state, action) => {
      state.isTailoringResume = action.payload;
    },
    setIsGeneratingCoverLetter: (state, action) => {
      state.isGeneratingCoverLetter = action.payload;
    },
    setIsGeneratingQA: (state, action) => {
      state.isGeneratingQA = action.payload;
    },
    
    setAiStatus: (state, action) => {
      state.aiStatus = { ...state.aiStatus, ...action.payload };
    },
    
    resetScraperState: () => initialState,
  }
});

export const { 
  updateJobData, 
  setExtractionState, 
  setIsTailoringResume, 
  setIsGeneratingCoverLetter,
  setIsGeneratingQA,
  setAiStatus, 
  resetScraperState 
} = scraperSlice.actions;

export default scraperSlice.reducer;