import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { 
  fetchCoverletters, 
  createCoverletter, 
} from './thunks';

const coverlettercrudSlice = createSlice({
  name: 'coverletters',
  initialState,
  reducers: {
    clearCoverletterError: (state) => {
      state.error = null;
    },
    hydrateCoverLetters: (state, action) => {
      if (action.payload) {
        state.allCoverletters = action.payload.allCoverletters || [];
        state.favCoverletterTemplateId = action.payload.favCoverletterTemplateId || null;
        // Optionally hydrate other metadata if needed
      }
    }
    
  },
  extraReducers: (builder) => {
    builder
      /* --- FETCH ALL --- */
      .addCase(fetchCoverletters.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchCoverletters.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.allCoverletters = action.payload;
      })
      .addCase(fetchCoverletters.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      /* --- CREATE --- */
      .addCase(createCoverletter.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(createCoverletter.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.allCoverletters.push(action.payload);
      })
      .addCase(createCoverletter.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
  },
});

export const { clearCoverletterError, hydrateCoverLetters } = coverlettercrudSlice.actions;
export default coverlettercrudSlice.reducer;