import { ChromeAI } from "@langchain/community/experimental/llms/chrome_ai";



export async function fetchfromai(prompt,maxtokens=10) {

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

      
      /*


async function api_Gemini(prompt, model, apiKey) {
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function fetchfromai(prompt,maxtokens) {

  
  try {
    const response = await api_Gemini(prompt, "gemini-2.0-flash", "AIzaSyDxxuRuDGWsRalSvh3rKH1BG2i__x3TAuY");
    
    if (!response) throw new Error("AI returned an empty response.");
    return response;
  } catch (err) {
    throw new Error(`LangChain Local AI Error: ${err.message}`);
  }
}
     **/