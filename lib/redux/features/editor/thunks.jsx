import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "../toast/thunks";
import { Companybackend } from "../../../../src/globalvar/companydetails";
import { setAiStatus, updateJobData ,setIsTailoringResume} from "../scraper/slice";
import { generateresumefromjobdata } from "../scraper/generate/resume/generateresumefromjobdata";
import { fetchResumes } from "../resumes/resumecrud/thunks";
import { updatePhase } from "./slice";


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

      const endpoint = type === "resume" ? `${Companybackend}resume/${activeId}` : `${Companybackend}coverletter/${activeId}`;

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


export const fetchAIdataforDocument = createAsyncThunk(
  "editor/fetchAIdata",
  async ({ type, sectionIds, token, phase, signal }, { dispatch, getState, rejectWithValue }) => {
    try {
      const { jobData } = getState().scraper;
      const { allResumes, primaryResumeId } = getState().resumecrud;

      const isFullTailor = phase.key === "full_tailor";
      dispatch(setIsTailoringResume(true));
      const updateProgress = (msg) => dispatch(setAiStatus({ active: true, message: msg }));

      const selectedResume = allResumes.find(r => r._id === jobData.resumeId);
      const copyTargetId = isFullTailor ? (selectedResume?._id || primaryResumeId) : null;

      const generateTask = generateresumefromjobdata(
        sectionIds, jobData, selectedResume || {}, 
        copyTargetId, updateProgress, dispatch, displayToast, signal
      );

      const result = await generateTask();

      if (result) {
        if (isFullTailor) {
          // CASE 1: Full Document - We update the activeId and sync the whole map
          dispatch(updateJobData({ resumeId: result._id }));
          dispatch(fetchResumes());
          
          // You could add a specific 'setFullDocument' reducer or loop through:
          dispatch(fetchDocumentById({ id: result._id, type: "resume" }));
        } else {
          // CASE 2: Single Phase - Use your existing updatePhase reducer!
          // result[phase.key] matches your JSON structure (e.g., result['careerSummary'])
          dispatch(updatePhase({ 
            phaseKey: phase.key, 
            data: result[phase.key] 
          }));
        }
        
        return result;
      }
      return rejectWithValue("Failed to generate AI data");
    } catch (err) {
      return rejectWithValue(err.message);
    } finally {
      dispatch(setIsTailoringResume(false));
      dispatch(setAiStatus({ active: false, message: "" }));
    }
  }
);