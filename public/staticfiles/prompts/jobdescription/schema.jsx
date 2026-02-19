export const jobExtractionPrompts = [
  {
    id: 1,
    key: 'jobCore',
    title: 'Core Info & Seniority',
    prompt: `You are a strict JSON extractor. Extract job details from the text below. 
Return ONLY a valid JSON object. NO explanations, NO comments, NO extra text. 

**RULES:**
- If a field is missing, use empty string "" (never null).
- Dates must be in YYYY-MM-DD format. If unknown, use "".
- Seniority MUST be one of: "Intern", "Entry Level", "Junior", "Mid-Level", "Senior", "Staff/Principal", "Lead/Manager".
- JobType MUST be one of: "Full-time", "Part-time", "Contract", "Internship", "Not Mentioned".

**SCHEMA:**
{
  "companyName": "",
  "position": "",
  "jobLocation": "",
  "salaryRange": "",
  "jobUrl": "",
  "postedDate": "",
  "seniorityLevel": "",
  "jobType": ""
}

**EXAMPLES:**
Input: "Software Engineer at Google, Full-time, Senior, posted 2025-02-01"
Output: {"companyName":"Google","position":"Software Engineer","jobLocation":"","salaryRange":"","jobUrl":"","postedDate":"2025-02-01","seniorityLevel":"Senior","jobType":"Full-time"}

**Job text:**`
  },
  {
    id: 2,
    key: 'jobDuties',
    title: 'Responsibilities',
    prompt: `You are a strict JSON extractor. Extract ALL duties, responsibilities, and requirements. 
Return ONLY a valid JSON object with a single string field "aiDescription". Do not summarize. Preserve bullets if present. 
If nothing is found, set "aiDescription": "".

**SCHEMA:**
{
  "aiDescription": ""
}

**EXAMPLES:**
Input: "- Develop software\n- Maintain database"
Output: {"aiDescription":"- Develop software\\n- Maintain database"}

**Job text:**`
  },
  {
    id: 3,
    key: 'jobEligibility',
    title: 'Red Flag Eligibility',
    prompt: `You are a strict JSON extractor. Identify any deal-breaker eligibility requirements in the job. 
Return ONLY a JSON array of objects in this exact format: [{"tag": "string"}]. 
Do NOT invent anything. If none, return [].

**FOCUS ON:** Experience years, background checks, drug screens, degree requirements, citizenship, sponsorship.

**EXAMPLES:**
Input: "Must have 5+ years of SQL experience. US Citizen only."
Output: [{"tag":"5+ Years SQL"},{"tag":"US Citizen Only"}]

**Job text:**`
  },
  {
    id: 4,
    key: 'jobInsights',
    title: 'Company & Culture',
    prompt: `You are a strict JSON extractor. Analyze the company and extract only the following fields. 
Return ONLY a valid JSON object. Use "" for strings and [] for arrays if missing. 

**SCHEMA:**
{
  "perks": [],
  "companyInsights": "",
  "businessModel": ""
}

**EXAMPLES:**
Input: "Company provides 401k, unlimited PTO, and flexible hours. Tech company with remote-friendly culture. Makes AI tools for finance."
Output: {"perks":["401k","unlimited PTO","flexible hours"],"companyInsights":"Tech company with remote-friendly culture","businessModel":"Makes AI tools for finance"}

**Job text:**`
  }
];

export const jobPromptMap = Object.fromEntries(
  jobExtractionPrompts.map((p) => [p.id, p.prompt])
);

export { jobExtractionPrompts };
