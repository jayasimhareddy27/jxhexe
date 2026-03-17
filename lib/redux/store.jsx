import { configureStore } from '@reduxjs/toolkit';

import aiAgentReducer from './features/aiagent/slice';
import authReducer from './features/auth/slice';
import themeReducer from './features/theme/slice';
import toastReducer from './features/toast/slice'; 

import jobReducer from './features/job/slice';
import scraperReducer from './features/scraper/slice';
//
import resumecrudReducer from './features/resumes/resumecrud/slice';
import coverlettercrudReducer from './features/coverletter/coverlettercrud/slice';
//
import editorReducer from './features/editor/slice';
//import followUpReducer from './features/followup/slice';


/**
 // 1. Define the logger middleware
const logger = (store) => (next) => (action) => {
  // This runs on every action across all pages
  console.group(`Action: ${action.type}`); 
  const result = next(action);
  console.log('Next State:', store.getState());
  console.groupEnd();
  return result;
};
middleware: (getDefaultMiddleware) =>   getDefaultMiddleware().concat(logger),
 */
export const makeStore = () => {
  return configureStore({
    reducer: {
      aiAgent: aiAgentReducer,
      auth: authReducer,
      editor: editorReducer,
      resumecrud: resumecrudReducer,
      theme: themeReducer,
      toast: toastReducer, 
      jobsStore: jobReducer,
      coverlettercrud: coverlettercrudReducer,
      //followupstore: followUpReducer, 
      scraper: scraperReducer
    },
    // 2. Add the logger to the default middleware
  });
};

   
