'use client'
import { fetchfromai } from "../../../../public/components/ai/llmapi";
import { jobPromptMap } from "../../../../public/staticfiles/prompts/jobdescription";

export async function fetchJobPhaseData(id, key, jobDescription, AiAgent, isArrayPhase = false) {
  const { provider, model, ApiKey } = AiAgent;
  
  const promptTemplate = jobPromptMap[id];
  
  if (!promptTemplate) {
    throw new Error(`No job prompt template found for ID ${id} (Key: ${key})`);
  }

  const prompt = `${promptTemplate}\n\n${jobDescription}`;
  
  // 2. Server-side AI Call
  const rawResponse = await fetchfromai(prompt, ApiKey, model, provider);
  
  // 3. Clean Markdown/Backticks
  const cleanedResponse = rawResponse.trim()
  .replace(/^```json\s*/, '')
  .replace(/^```/, '')
  .replace(/```$/, '')
  .trim();
  
  let data = JSON.parse(cleanedResponse);

  // 4. SMART CLEANING: Flatten Objects to Strings
  // If it's Step 2 (Requirements) or Step 3 (Eligibility), convert objects to strings/tags
  if (isArrayPhase && Array.isArray(data)) {
    if (id === 2) {
      // [{requirement: "SQL"}] -> ["SQL"]
      return data.map(item => item.requirement || item).filter(Boolean);
    }
    if (id === 3) {
      // [{tag: "Remote"}] -> ["Remote"]
      return data.map(item => item.tag || item).filter(Boolean);
    }
    return data;
  }

  // Handle Step 1 and 4 (Object phases)
  return isArrayPhase ? [data] : data;
}

/**
 * Sanitizes AI-extracted data to ensure no nulls reach React 
 * and applies default values for missing fields based on JXH schema.
 */
export const sanitizeJobData = (rawPayload) => {
  const today = new Date().toISOString().split('T')[0];
  
  const validSeniority = ['Intern', 'Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Staff/Principal', 'Lead/Manager'];
  const validTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Not Mentioned'];

  return {
    // Basic strings - ensure they never fall to null/undefined
    companyName: rawPayload.companyName?.trim() || "Unknown Company",
    position: rawPayload.position?.trim() || "Position Not Specified",
    rawDescription: rawPayload.rawDescription || "",
    aiDescription: rawPayload.aiDescription?.trim() || "No duties extracted",
    businessModel: rawPayload.businessModel?.trim() || "Information not found",
    companyInsights: rawPayload.companyInsights?.trim() || "",
    
    // Dropdown/Enum Safety
    seniorityLevel: validSeniority.includes(rawPayload.seniorityLevel) ? rawPayload.seniorityLevel : "",
    jobType: validTypes.includes(rawPayload.jobType) ? rawPayload.jobType : "Not Mentioned",

    // Logistics & Date Fix (Preventing YYYY-MM-DD crash)
    salary: rawPayload.salary?.trim() || "Not Mentioned",
    jobLocation: rawPayload.jobLocation?.trim() || "Not Mentioned",
    jobUrl: rawPayload.jobUrl?.trim() || "",
    postedDate: (!rawPayload.postedDate || rawPayload.postedDate === "YYYY-MM-DD") ? today : rawPayload.postedDate,
    
    status: rawPayload.status || "saved"
  };
};