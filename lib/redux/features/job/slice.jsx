import { createSlice } from "@reduxjs/toolkit";
import { initialJobState } from "./state";
import {
  fetchJobs,
  createJob,
  fetchJobById,
  updateJob,
} from "./thunks";

const jobSlice = createSlice({
  name: "jobs",
  initialState: initialJobState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    }
  },
  extraReducers: (builder) => {
    builder

      /* ===============================
         FETCH ALL JOBS
      =============================== */
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;

        if (action.meta.arg === "market") {
          state.marketListing = action.payload;
        } else {
          state.trackerListing = action.payload;
          state.trackerListing = action.payload;
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         FETCH SINGLE JOB
      =============================== */
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         CREATE JOB
      =============================== */
      .addCase(createJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;

        // Add new job to top of tracker list
        state.trackerListing.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         UPDATE JOB 
      =============================== */
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;

        const updatedJob = action.payload;
        if (!updatedJob?._id) return;

        const index = state.trackerListing.findIndex(
          (j) => j._id === updatedJob._id
        );

        if (index !== -1) {
          state.trackerListing[index] = {
            ...state.trackerListing[index],
            ...updatedJob,
          };
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSearchFilter, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
