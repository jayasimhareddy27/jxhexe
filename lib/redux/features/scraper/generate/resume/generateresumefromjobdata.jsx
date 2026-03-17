import { Companybackend } from "../../../../../../src/globalvar/companydetails";
import { fetchfromai } from "../../../../../../public/components/ai/llmapi";
import { resumeformatPrompts } from "../../../../../../public/staticfiles/prompts/resume/schema";
import { convertResumeToPromptString } from ".";

export const generateresumefromjobdata = (sectionIds, jobData, currentResume, copyTargetId, onProgress, dispatch, displayToast, signal) => async () => {
  const tailoredResult = {};
  const token = localStorage.getItem("token");
  
  try {
    let baseResume = currentResume;

    // CASE 1: Full Document from scratch (Copy existing)
    // We still copy here because we need a valid _id for the new document
    if (copyTargetId) {
      if (onProgress) onProgress("Creating resume copy...");
      const copyResponse = await fetch(`${Companybackend}resume/copy`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeId: copyTargetId, 
          newName: `${jobData.companyName}_${jobData.position}` 
        }),
        signal
      });
      if (!copyResponse.ok) throw new Error("Failed to copy resume");
      const data = await copyResponse.json();
      baseResume = data.newResume;
    }

    // CASE 2: Generate AI tailoring for sections
    for (const id of sectionIds) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      const config = Object.values(resumeformatPrompts).find(p => p.id === id);
      if (!config) continue;

      if (onProgress) onProgress(`Tailoring ${config.title}...`);
      const prompt = `${config.prompt} ${convertResumeToPromptString(baseResume)} JobDescription: ${jobData?.rawDescription}`;
      
      const response = await fetchfromai(prompt, 1000);
      const cleanJson = response.replace(/```json|```/g, "").trim();
      tailoredResult[config.key] = JSON.parse(cleanJson);
    }

    // Return the merged draft WITHOUT saving to DB
    return { 
      ...baseResume, 
      ...tailoredResult,
      designConfig: baseResume.designConfig || currentResume.designConfig 
    };

  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error("AI Generation Error:", error);
    dispatch(displayToast({ message: `Failed: ${error.message}`, type: 'error' }));
    return null;
  }
};