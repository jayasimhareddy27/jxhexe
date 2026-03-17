import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "../toast/thunks";
import { extractJobPhase } from "./";
import { Companybackend } from '../../../../src/globalvar/companydetails';


/* =====================================================
    CREATE JOB
===================================================== */
export const createJob = createAsyncThunk(
  "jobs/create",
  async (jobData, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await fetch(`${Companybackend}jobs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Error saving job");
      }

      const data = await response.json();
      // Most APIs return the saved object in a 'job' key or directly
      const savedJob = data.job || data;

      dispatch(
        displayToast({
          message: `Job at ${savedJob.companyName} saved`,
          type: "success",
        })
      );

      return savedJob;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

/* =====================================================
    FETCH SINGLE JOB
===================================================== */
export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (jobId, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await fetch(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Job not found");
      }

      const data = await response.json();
      return data.job || data;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

/* =====================================================
    UPDATE JOB (FIXED TOKEN ACCESS)
===================================================== */
export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, updates }, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // Fixed: Now correctly grabbing the token

      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      const data = await response.json();
      const updatedJob = data.job || data;

      dispatch(
        displayToast({
          message: "Job status updated",
          type: "success",
        })
      );

      return updatedJob;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);