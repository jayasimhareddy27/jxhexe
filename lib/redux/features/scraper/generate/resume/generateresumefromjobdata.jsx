import { resumeformatPrompts } from "../../../../../../public/staticfiles/prompts/resume/schema";
import { convertResumeToPromptString } from ".";
import { updatePhase } from "../../../editor/slice";
import { saveDocumentById } from "../../../editor/thunks";
import { fetchfromai } from "../../../../../../public/components/ai/llmapi";

export const generateresumefromjobdata = (aiAgent,sectionIds, jobData, currentResume,  onProgress, dispatch, displayToast, signal) => async () => {
  const token = localStorage.getItem("token");
  const { apiKey, agent, provider} =aiAgent
  try {
    let baseResume = currentResume ? structuredClone(currentResume) : {};    

    // CASE 2: Generate AI tailoring for sections
    for (const id of sectionIds) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      const config = Object.values(resumeformatPrompts).find(p => p.id === id);
      if (!config) continue;

      if (onProgress) onProgress(`Tailoring ${config.title}...`);
      const prompt = `${config.prompt} ${convertResumeToPromptString(baseResume)} JobDescription: ${jobData?.rawDescription}`;
      
      const response = await fetchfromai(prompt,apiKey, agent, provider, 1000);
      const cleanJson = response.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(cleanJson);

      dispatch(updatePhase({   phaseKey: config.key,   data: parsedData }));
      dispatch(saveDocumentById());
      
      baseResume[config.key] = parsedData;
    }
    
    // Return the merged draft WITHOUT saving to DB
    return { 
      ...baseResume, 
    };

  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error("AI Generation Error:", error);
    dispatch(displayToast({ message: `Failed: ${error.message}`, type: 'error' }));
    return null;
  }
};