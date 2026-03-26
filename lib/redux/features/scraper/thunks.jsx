import { updateJobData, setExtractionState, setIsTailoringResume, setIsGeneratingCoverLetter, setAiStatus } from "./slice";
import { displayToast } from "../toast/thunks";
import { fetchResumes } from "../resumes/resumecrud/thunks";
import { fetchCoverletters } from "../coverletter/coverlettercrud/thunks";

import { lazyDescriptionExtractor, analyzeJobInsights, extractByUrl, parseSalaryString } from "./jobextractionutils/utils";
import { sanitizeJobData } from "../job/index"; 

// ------------------------------------------------------------------
// 0. INITIALIZATION THUNK 
// ------------------------------------------------------------------
export const initializeScraperDataThunk = () => async (dispatch, getState) => {
  try {
    await Promise.all([
      dispatch(fetchResumes()).unwrap(),
      dispatch(fetchCoverletters()).unwrap()
    ]);

    const state = getState();
    const { primaryResumeId } = state.resumecrud;
    const { jobData } = state.scraper;

    let savedResume = "";
    let savedCL = "";
    if (typeof window !== "undefined") {
      savedResume = sessionStorage.getItem("selected_resume_id");
      savedCL = sessionStorage.getItem("selected_cl_id");
    }

    const finalResumeId = savedResume || jobData.resumeId || primaryResumeId || "";
    const finalCoverLetterId = savedCL || jobData.coverLetterId || "";

    dispatch(updateJobData({
      resumeId: finalResumeId,
      coverLetterId: finalCoverLetterId
    }));
  } catch (error) {
    console.error("Failed to initialize scraper data:", error);
    dispatch(displayToast({ message: "Cloud sync failed", type: 'error' }));
  }
};

// ------------------------------------------------------------------
// 1. EXTRACTION PIPELINE THUNK
// ------------------------------------------------------------------
export const runExtractionPipelineThunk = (signal) => async (dispatch, getState) => {
  dispatch(setExtractionState({ isExtracting: true, isLazyLoading: false, flashDeepData: false }));
  const parser = new DOMParser();
  const state = getState();
  const aiAgent = state.aiAgent;
  
  try {
// 1. Target the currently active browser tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || signal?.aborted) return;
// 2. Inject a script to grab the full HTML of the job page
    const [{result:jobdatadocument}] = await chrome.scripting.executeScript({target: { tabId: tab.id },func: () => document.documentElement.innerHTML})

    const doc = parser.parseFromString(jobdatadocument, "text/html");
    const urlData = await extractByUrl(doc, tab.url,aiAgent) || {}; // Identify site (LinkedIn, Indeed, etc.) and run specific selectors
    const structuredSalary = parseSalaryString(urlData.rawSalary);
    const scrapedData = {companyName: urlData.companyName || "",position: urlData.position || "",jobLocation: urlData.jobLocation || "",minSalary: structuredSalary.min,maxSalary: structuredSalary.max,currency: structuredSalary.currency,period: structuredSalary.period,rawDescription: urlData.descriptionSelector || ""};
    const payload = {...scrapedData,jobUrl: tab.url,aiDescription: "Direct Site-Specific Extraction complete.",tags: []};
    
    if (signal?.aborted) return;

    const sanitized = sanitizeJobData(payload);
    dispatch(updateJobData(sanitized));
    dispatch(setExtractionState({ isExtracting: false, isLazyLoading: true }));
    
    const [rewrittenDescription, insights] = await Promise.all([
      lazyDescriptionExtractor(tab, signal,aiAgent),
      analyzeJobInsights(tab, signal,aiAgent)
    ]);

    
    
    const currentJobData = getState().scraper.jobData;
    dispatch(updateJobData({rawDescription: rewrittenDescription || currentJobData.rawDescription,seniorityLevel: insights?.seniorityLevel || currentJobData.seniorityLevel,jobType: insights?.jobType || currentJobData.jobType,postedDate: insights?.postedDate || currentJobData.postedDate,businessModel: insights?.businessModel || currentJobData.businessModel,companyInsights: insights?.companyInsights || currentJobData.companyInsights,requirements: insights?.requirements || currentJobData.requirements,perks: insights?.perks || currentJobData.perks}));
    dispatch(setExtractionState({ flashDeepData: true }));
    setTimeout(() => {  dispatch(setExtractionState({ flashDeepData: false }));}, 800);
    dispatch(setExtractionState({ isLazyLoading: false }));
  } catch (err) {
    if (err.name === 'AbortError') return;
    console.log(err);
    
    dispatch(displayToast({ message: "Extraction failed", type: 'error' }));
    dispatch(setExtractionState({ isExtracting: false, isLazyLoading: false }));
  }
};

