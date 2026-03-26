import { createAsyncThunk } from "@reduxjs/toolkit";
import { displayToast } from "../toast/thunks";
import { Companybackend } from "../../../../src/globalvar/companydetails";
import { setAiStatus, updateJobData ,setIsTailoringResume,setIsGeneratingCoverLetter} from "../scraper/slice";
import { generateresumefromjobdata } from "../scraper/generate/resume/generateresumefromjobdata";
import { fetchResumes } from "../resumes/resumecrud/thunks";
import { generatecoverletterfromjobdata } from "../scraper/generate/coverletter/generatecoverletterfromjobdata";
import { fetchCoverletters } from "../coverletter/coverlettercrud/thunks";

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
  async ({ type, sectionIds, signal }, { dispatch, getState, rejectWithValue }) => {
    try {
      const { jobData } = getState().scraper;
      const aiAgent = getState().aiAgent;

      dispatch(setIsTailoringResume(true));
      const updateProgress = (msg) => dispatch(setAiStatus({ active: true, message: msg }));

      if (type === "resume") {
        dispatch(setIsTailoringResume(true));
      } else {
        dispatch(setIsGeneratingCoverLetter(true));
      }

      let generateTask;

      const { allResumes } = getState().resumecrud;
      let selectedResume = allResumes.find(r => r._id === jobData.resumeId);
      if (type === "resume") {
        generateTask = generateresumefromjobdata(  aiAgent,sectionIds, jobData, selectedResume, updateProgress, dispatch, displayToast, signal);
      }else{
        const { allCoverletters } = getState().coverlettercrud;
        const selectedCL = allCoverletters.find(cl => cl._id === jobData.coverLetterId);
        generateTask = generatecoverletterfromjobdata(aiAgent, sectionIds, jobData, selectedCL, selectedResume,updateProgress, dispatch, displayToast, signal);
      }


      const result = await generateTask();

      if (!result) {
        return rejectWithValue("Failed to generate AI data");
      }
      // 3. Post-Generation Refresh
      if (type === "resume") {
        await dispatch(fetchResumes()).unwrap();
      } else {
        await dispatch(fetchCoverletters()).unwrap();
      }
      dispatch(displayToast({   message: `New tailored ${type === "resume" ? "resume" : "cover letter"} created and selected!`,   type: "success" }));
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    } finally {
      dispatch(setIsTailoringResume(false));
      dispatch(setAiStatus({ active: false, message: "" }));
    }
  }
);