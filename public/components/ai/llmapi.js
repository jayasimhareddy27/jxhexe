import { ChromeAI } from "@langchain/community/experimental/llms/chrome_ai";


export async function fetchfromai(prompt,maxtokens) {

  const model = new ChromeAI({
    temperature: 0, // Absolute strictness
    topK: 1,        // No variability
    maxTokens: maxtokens, // Speed: smaller response = faster generation
  });
  try {
    const response = await model.invoke(prompt);
    
    if (!response) throw new Error("AI returned an empty response.");
    return response;
  } catch (err) {
    throw new Error(`LangChain Local AI Error: ${err.message}`);
  }
}

// Keep the internal name available for your other components
export const api_ChromeAI = fetchfromai;