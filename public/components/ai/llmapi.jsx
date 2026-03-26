'use client'
import { aiManager } from "./chromeaimanager";
// --- Main Switcher ---
export async function fetchfromai(prompt, apiKey, agent, provider, maxtokens) {
  switch (provider) {
    case 'Gemini':
      return await api_Gemini(prompt, agent, apiKey, maxtokens);
    case 'HuggingFace':
      return await api_HuggingFaceai(prompt, agent, apiKey, maxtokens);
    case 'Ollama':
      return await api_Ollama(prompt, agent, apiKey, maxtokens); // apiKey acts as the URL for Ollama
    case 'ChromeAI':
      return await api_ChromeAI(prompt, maxtokens);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

// --- HuggingFace (OpenAI Compatible Router) ---
async function api_HuggingFaceai(prompt, agent, apiKey, maxtokens=1000) {
  
  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:agent,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxtokens, // Added
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

// --- Google Gemini (External API) ---
async function api_Gemini(prompt, agent, apiKey, maxtokens=1000) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/agents/${agent}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxtokens, // Added
          temperature: 0.7,
        }
      }),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// --- Ollama (Local Server) ---
async function api_Ollama(prompt, agent, url, maxtokens=1000) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:agent,
      prompt,
      stream: false,
      options: {
        num_predict: maxtokens, // Added for Ollama
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.response || '';
}

async function api_ChromeAI(prompt) {
  try {
    const agent = await aiManager.getModel({ temperature: 0.5, topK: 40 });
    const response = await agent.invoke(prompt);
    return response;
  } catch (error) {
    await aiManager.dispose();
    throw new Error(`Chrome AI Error: ${error.message}`);
  }
}



export { api_Gemini, api_HuggingFaceai, api_Ollama, api_ChromeAI };