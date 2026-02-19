import { aiKeys } from '@/globalvar/autoapis';
import { api_Gemini, api_HuggingFaceai, api_Ollama } from '@components/ai/llmapi';
import { geminiModels, huggingFaceModels } from '@/globalvar/companydetails';

export async function testGeminiApiKey() {  
  for (const key of aiKeys['gemini']) {
    try {
      
      const response = await api_Gemini('2+2', geminiModels[0].value, key);
      if (response) {
        return { provider: 'Gemini', model: geminiModels[0].value, ApiKey: key };
      }
    } catch {}
  }
  return null;
}

export async function testHuggingFaceApiKey() {
  for (const key of aiKeys.huggingFace) {
    try {
      const response = await api_HuggingFaceai('no explanation, integer only: 2+2=?', huggingFaceModels[0].value, key);
      if (response == 4) {
        return { provider: 'HuggingFace', model: huggingFaceModels[0].value, ApiKey: key };
      }
    } catch {}
  }
  return null;
}

export async function testOllamaConnection() {
  try {
    const response = await api_Ollama('integer only: 2+2=?', 'http://localhost:11434/api/generate', 'llama3.2');
    if (response) {
      return { provider: 'Ollama', model: 'llama3.2', ApiKey: 'http://localhost:11434/api/generate' };
    }
  } catch {}
  return null;
}
