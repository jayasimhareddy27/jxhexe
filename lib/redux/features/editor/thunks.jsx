import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "../toast/thunks";
import { Companybackend } from "../../../../src/globalvar/companydetails";

/* ================================
   FETCH DOCUMENT BY ID (CV or CL)
================================ */
export const fetchDocumentById = createAsyncThunk(
  "editor/fetchDocumentById",
  async ({ id, type }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // Dynamically select endpoint based on type: 'resume' or 'coverletter'
      const endpoint = type === "resume" ? `${Companybackend}/resume/${id}` : `${Companybackend}/coverletter/${id}`;

      const response = await fetch(endpoint, {headers: {  Authorization: `Bearer ${token}`,},});

      if (!response.ok) throw new Error(`Failed to fetch ${type}`);

      const document = await response.json();
      return { ...document, type }; // Include type to help the reducer update state.type
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);

/* ================================
   SAVE DOCUMENT (CV or CL)
================================ */
export const saveDocumentById = createAsyncThunk(
  "editor/saveDocumentById",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { activeId, type, formDataMap } = getState().editor;

      if (!activeId || !type) throw new Error("Missing document ID or type");

      const endpoint = type === "resume" ? `/api/resume/${activeId}` : `/api/coverletter/${activeId}`;

      // Ensure designConfig and core document map are structured correctly
      const payload = {...formDataMap,designConfig: formDataMap.designConfig || {},};

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {  "Content-Type": "application/json",  Authorization: `Bearer ${token}`,},
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Failed to save ${type}`);

      const updatedDocument = await response.json();

      dispatch(displayToast({message: `${type === "resume" ? "Resume" : "Cover Letter"} saved successfully!`,type: "success",}));

      return updatedDocument;
    } catch (error) {
      dispatch(displayToast({ message: error.message, type: "error" }));
      return rejectWithValue(error.message);
    }
  }
);