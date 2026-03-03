import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { 
  fetchCoverletters, 
  createCoverletter, 
  deleteCoverletter, 
  copyCoverletter, 
  markPrimaryCoverletterTemplate 
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

      /* --- DELETE --- */
      .addCase(deleteCoverletter.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(deleteCoverletter.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.allCoverletters = state.allCoverletters.filter(
          (cl) => cl._id !== action.payload
        );
      })
      .addCase(deleteCoverletter.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      /* --- COPY --- */
      .addCase(copyCoverletter.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(copyCoverletter.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.allCoverletters.push(action.payload);
      })
      .addCase(copyCoverletter.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      /* --- MARK PRIMARY --- */
      .addCase(markPrimaryCoverletterTemplate.fulfilled, (state, action) => {
        state.favCoverletterTemplateId = action.payload;
      });
  },
});

export const { clearCoverletterError, hydrateCoverLetters } = coverlettercrudSlice.actions;
export default coverlettercrudSlice.reducer;