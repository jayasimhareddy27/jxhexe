import { clFormatPrompts } from "../../../../../../public/staticfiles/prompts/coverletter/schema"; // Ensure this path is correct
import { fetchfromai } from "../../../../../../public/components/ai/llmapi";
import { updatePhase } from "../../../editor/slice";
import { saveDocumentById } from "../../../editor/thunks";
import { convertResumeToPromptString } from "../resume";

export const generatecoverletterfromjobdata = (  aiAgent,   sectionIds,   jobData,   currentCL,selectedResume,   onProgress,   dispatch,   displayToast,   signal) => async () => {
  const token = localStorage.getItem("token");
  const { apiKey, agent, provider } = aiAgent;

  try {
    let baseCL = currentCL ? structuredClone(currentCL) : {};

    // 2. Loop through requested sections (e.g., Intro, Body, Conclusion)
    for (const id of sectionIds) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

      // Find the prompt configuration for this section ID
      const config = Object.values(clFormatPrompts).find(p => p.id === id);
      if (!config) continue;

      if (onProgress) onProgress(`Writing ${config.title}...`);

      const prompt = `${config.prompt} Job Description: ${jobData?.rawDescription} My Resume for reference:${convertResumeToPromptString(selectedResume)}`;
      
      
      // 3. Call AI
      const response = await fetchfromai(prompt, apiKey, agent, provider, 1500);
      
      // 4. Clean and Parse JSON
      const cleanJson = response.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(cleanJson);

      // 5. Update Redux Store immediately for the "Live" feel
      dispatch(updatePhase({ 
        phaseKey: config.key, 
        data: parsedData 
      }));

      // 6. Save to Database after each section is generated
      await dispatch(saveDocumentById()).unwrap();
      
      // Update local reference for the next iteration of the loop
      baseCL[config.key] = parsedData;
    }
    
    return baseCL;

  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error("CL Generation Error:", error);
    dispatch(displayToast({ message: `CL Generation Failed: ${error.message}`, type: 'error' }));
    return null;
  }
};