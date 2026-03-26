'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { ArrowLeft } from 'lucide-react'; // Import Back Icon
import { connectAiAgent } from '../../../lib/redux/features/aiagent/thunks';
import { displayToast } from '../../../lib/redux/features/toast/thunks';
import { geminiModels, huggingFaceModels, ollamaModels } from '../../../src/globalvar/companydetails';
import { returnuseReference } from '../../../lib/redux/features/resumes/resumecrud/thunks';

// --- Utility: Masking and Formatting ---
const maskKey = (key) => {
  if (!key || key.length < 8) return "********";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
};

// --- SHARED COMPONENT: AIProviderSection ---
const AIProviderSection = ({ title, provider, models, activeAgent, savedKeys, onAction, isLoading }) => {
  const [config, setConfig] = useState({ 
    model: models ? models[0]?.value : '', 
    ApiKey: provider === 'Ollama' ? 'http://localhost:11434/api/generate' : ''
  });
  
  const filteredKeys = savedKeys?.filter(k => k.provider === provider) || [];

  return (
    <div className="flex flex-col gap-6">
      <section className="p-6 rounded-2xl border bg-[color:var(--color-card-bg)] shadow-xl space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-widest border-b pb-2">New {title}</h2>
        <div className="space-y-3">
          {models ? (
            <select 
              value={config.model} 
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full p-2 border rounded-xl bg-transparent"
            >
              {models.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          ) : (
            <input 
              type="text" placeholder="Model Name" value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full p-2 border rounded-xl bg-transparent"
            />
          )}
          <input 
            type="text" 
            placeholder={provider === 'Ollama' ? "Server URL" : "Paste API Key"} 
            value={config.ApiKey}
            onChange={(e) => setConfig({ ...config, ApiKey: e.target.value })}
            className="w-full p-2 border rounded-xl bg-transparent"
          />
          <button 
            onClick={() => onAction(provider, config, false)}
            disabled={isLoading}
            className="w-full py-3 bg-amber-300 rounded-xl font-black shadow-lg transition-all hover:bg-amber-400 disabled:opacity-50"
          >
            {isLoading ? 'SYNCING...' : 'CONNECT & SAVE'}
          </button>
        </div>
      </section>

      {filteredKeys.length > 0 && (
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest px-1 text-gray-500 text-left">
            Saved {title} Agents
          </p>
          <div className="grid gap-2">
            {filteredKeys.map(k => (
              <button 
                key={k._id}
                onClick={() => onAction(provider, { model: k.agent, ApiKey: k.apiKey }, true)}
                className={`flex flex-col items-start p-3 rounded-xl border transition text-left bg-white
                  ${activeAgent === k.agent ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <span className="text-xs font-bold text-gray-900">
                  {k.agent.includes('/') ? k.agent.split('/').pop() : k.agent}
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  {provider === 'Ollama' ? k.apiKey : maskKey(k.apiKey)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE ---
// Pass onBack prop from Homepage to return to tabs
const SettingsPage = ({ onBack }) => {
  const dispatch = useDispatch();
  const { loading, agent: activeAgent } = useSelector((state) => state.aiAgent, shallowEqual);
  const { token } = useSelector((state) => state.auth, shallowEqual);
  const { aiKeys } = useSelector((state) => state.resumecrud, shallowEqual);
  
  const isLoading = loading === 'loading';

  useEffect(() => {
    if (token) dispatch(returnuseReference(token));
  }, [dispatch, token]);

  const handleAction = async (provider, config, isExisting = false) => {
    const duplicate = aiKeys?.find(k => k.apiKey === config.ApiKey);
    let effectiveIsExisting = isExisting || !!duplicate;
    
    dispatch(connectAiAgent({ provider, ...config, isExisting: effectiveIsExisting }))
      .unwrap()
      .then(() => {
        dispatch(displayToast({ 
          message: effectiveIsExisting ? `Switched to ${config.model}` : `New ${provider} agent saved!`, 
          type: 'success' 
        }));
        if (!effectiveIsExisting) dispatch(returnuseReference(token));
      })
      .catch((error) => dispatch(displayToast({ message: error, type: 'error' })));
  };

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-8 bg-[var(--color-background-primary)] min-h-screen">
      {/* HEADER WITH BACK BUTTON */}
      <header className="flex items-center gap-4 border-b pb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
          title="Back to Tabs"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-left">
          <h1 className="text-3xl font-black tracking-tight uppercase">AI Command Center</h1>
          <p className="text-[var(--color-text-secondary)] font-medium text-sm">
            Manage your neural connections.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8 ">
        <div>
          <AIProviderSection 
            title="Gemini" provider="Gemini" models={geminiModels} 
            activeAgent={activeAgent} savedKeys={aiKeys} onAction={handleAction} isLoading={isLoading}
          />
          
        </div>
        <div>
        <AIProviderSection 
          title="HuggingFace" provider="HuggingFace" models={huggingFaceModels} 
          activeAgent={activeAgent} savedKeys={aiKeys} onAction={handleAction} isLoading={isLoading}
        />

        </div>
        <div>
<AIProviderSection 
          title="Ollama" provider="Ollama" models={ollamaModels} 
          activeAgent={activeAgent} savedKeys={aiKeys} onAction={handleAction} isLoading={isLoading}
        />
        </div>
        
      </div>
    </main>
  );
};

export default SettingsPage;