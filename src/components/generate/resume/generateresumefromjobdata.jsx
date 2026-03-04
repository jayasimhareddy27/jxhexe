import { fetchfromai } from "../../../../public/components/ai/llmapi";

/**
 * Generates a tailored resume patch based on Job Data.
 * Focuses on pivoting experience toward Jira, Confluence, and Cloud Admin roles.
 */
export const generateresumefromjobdata = (jobData, currentResume = {}) => async () => {
  console.log("🛠️ AI: Analyzing Job Description for Resume Tailoring...");

  // Build a prompt that forces the AI to use your specific schema
  const prompt = `
    Act as a Technical Resume Strategist. 
    Rewrite the following resume sections to match this job: ${jobData.position} at ${jobData.companyName}.
    
    JOB DESCRIPTION: 
    ${jobData.rawDescription}

    USER'S CURRENT DATA:
    ${JSON.stringify({
      workExperience: currentResume.workExperience || [],
      projects: currentResume.projects || [],
      skillsSummary: currentResume.skillsSummary || {}
    })}

    STRICT INSTRUCTIONS:
    1. Rewrite work history and projects to emphasize: Jira/Confluence administration, Atlassian plugins, Cloud security (Top Secret context), and automation.
    2. Use simple language. No jargon.
    3. Output MUST be a valid JSON object only. No preamble. No markdown.

    REQUIRED JSON SCHEMA:
    {
      "careerSummary": { "summary": "string", "summaryGenerated": "string" },
      "skillsSummary": { "technicalSkills": "string", "tools": "string", "softSkills": "string", "languagesSpoken": "string", "certificationsSkills": "string" },
      "workExperience": [{ "companyName": "string", "jobTitle": "string", "responsibilities": "string", "location": "string", "startDate": "string", "endDate": "string" }],
      "projects": [{ "projectName": "string", "projectDescription": "string", "technologiesUsed": "string", "startDate": "string", "endDate": "string", "projectLink": "string" }]
    }
  `;

  try {
    // Calling your ChromeAI utility
    const response = await fetchfromai(prompt, 2500);

    // Clean the response: Remove markdown code blocks if present
    const cleanJson = response.replace(/```json|```/g, "").trim();
    
    const parsedData = JSON.parse(cleanJson);

    console.log("✅ TAILORED RESUME DATA GENERATED:", parsedData);
    return parsedData;

  } catch (err) {
    console.error("❌ Resume Generation Logic Error:", err);
    // Return the initial structure to prevent UI crashes
    return null;
  }
};