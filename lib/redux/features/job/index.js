'use client'
import { fetchfromai } from "../../../../public/components/ai/llmapi";
import { jobPromptMap } from "../../../../public/staticfiles/prompts/jobdescription";

export async function fetchJobPhaseData(id, key, jobDescription,maxtokens=80) {
  const promptTemplate = jobPromptMap[id];
  
  if (!promptTemplate) throw new Error(`No job prompt template found for ID ${id} (Key: ${key})`);
  
  const prompt = `${promptTemplate}\n\n${jobDescription}`;
  
  const rawResponse = await fetchfromai(prompt,maxtokens);
  
  // 3. Clean Markdown/Backticks
  const cleanedResponse = rawResponse.trim().replace(/^```json\s*/, '').replace(/^```/, '').replace(/```$/, '').trim();
  let data = JSON.parse(cleanedResponse);
  return  data;
}

export const sanitizeJobData = (rawPayload) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Validation lists matching your Mongoose Enums
  const validSeniority = ['Intern', 'Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Staff/Principal', 'Lead/Manager'];
  const validTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Not Mentioned'];
  const validStages = ['saved', 'applied', 'screening', 'interview', 'assessment', 'offer', 'decision', 'archived'];

  // Salary Combination Logic
  const formatSalary = () => {
    const { minSalary, maxSalary, currency = "USD", period = "yearly" } = rawPayload;
    if (!minSalary && !maxSalary) return "";
    
    const range = maxSalary ? `${minSalary}-${maxSalary}` : minSalary;
    return `${currency} ${range} / ${period}`;
  };

  return {
    // --- CORE INFO ---
    companyName: rawPayload.companyName?.trim() || "Unknown Company",
    position: rawPayload.position?.trim() || "Unknown Position",
    seniorityLevel: validSeniority.includes(rawPayload.seniorityLevel) ? rawPayload.seniorityLevel : "",
    jobType: validTypes.includes(rawPayload.jobType) ? rawPayload.jobType : "Not Mentioned",

    // --- DESCRIPTION SYSTEM ---
    rawDescription: rawPayload.rawDescription || "",
    aiDescription: rawPayload.aiDescription?.trim() || "",

    // --- ANALYTICS & STRATEGY ---
    // Ensure requirements is an array of strings
    requirements: Array.isArray(rawPayload.requirements) 
      ? rawPayload.requirements 
      : (rawPayload.requirements ? [rawPayload.requirements] : []),
    
    // Schema expects perks as an array
    perks: Array.isArray(rawPayload.perks) ? rawPayload.perks : [],
    businessModel: rawPayload.businessModel?.trim() || "Not Mentioned",
    companyInsights: rawPayload.companyInsights?.trim() || "",

    // --- LOGISTICS & STATUS ---
    stage: validStages.includes(rawPayload.stage) ? rawPayload.stage : "saved",
    // Schema default for 'state' is 'pending', handled by Mongoose
    
    jobLocation: rawPayload.jobLocation?.trim() || "",
    jobUrl: rawPayload.jobUrl?.trim() || "",
    postedDate: (!rawPayload.postedDate || rawPayload.postedDate === "YYYY-MM-DD") 
      ? today 
      : rawPayload.postedDate,

    minSalary: rawPayload.minSalary || null,
    maxSalary: rawPayload.maxSalary || null,
    currency: rawPayload.currency || "USD",
    period: rawPayload.period || "yearly",
    // Combined String for Mongoose salary field
    salary: formatSalary()
  };
};