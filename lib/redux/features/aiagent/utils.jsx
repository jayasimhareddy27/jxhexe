// Fisher-Yates shuffle algorithm
export const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  
  return array;
};




// You can add other utility functions here in the future

// This function now uses the 'provider' to decide which API to call.
export async function fetchfromai(prompt, apiKey, model, provider) {
  switch (provider) {
    case 'Gemini':
      return await api_Gemini(prompt, model, apiKey);
    case 'HuggingFace':
      return await api_HuggingFaceai(prompt, model, apiKey);
    case 'Ollama':
      return await api_Ollama(prompt, apiKey, model); // Ollama uses the ApiKey as the URL
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

async function api_HuggingFaceai(prompt, model, apiKey) {
  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

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

async function api_Ollama(prompt, url, model) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.response || '';
}

export { api_Gemini, api_HuggingFaceai, api_Ollama };