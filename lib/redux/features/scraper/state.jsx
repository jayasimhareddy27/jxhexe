export const INITIAL_JOB_STATE = {
  resumeId: "", 
  coverLetterId: "", 
  companyName: "", 
  position: "", 
  seniorityLevel: "", 
  jobType: "Not Mentioned", 
  rawDescription: "", 
  aiDescription: "", 
  requirements: [], 
  perks: [], 
  businessModel: "Not Mentioned", 
  companyInsights: "",
  stage: "saved", 
  state: "pending",
  postedDate: new Date().toISOString().split('T')[0],
  jobLocation: "", 
  jobUrl: "", 
  minSalary: "", 
  maxSalary: "", 
  currency: "USD", 
  period: "yearly",
  resumeMatchScore: 82 
};

export const initialState = {
  jobData: INITIAL_JOB_STATE,
  hasScraped: false, // Prevents re-scraping on tab switch
  isExtracting: false,
  isLazyLoading: false,
  flashDeepData: false,
  isTailoringResume: false,        // Replaced generic isTailoring
  isGeneratingCoverLetter: false,  // Specific to CL
  isGeneratingQA: false,           // Specific to QA
  aiStatus: { active: false, message: "" },
};