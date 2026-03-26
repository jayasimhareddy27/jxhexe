'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAgent } from './slice';

export default function AIAgentPersistence() {
  const dispatch = useDispatch();
  const { agent, provider, apiKey,loading } = useSelector((state) => state.aiAgent);

  // On initial load, try to load the agent from localStorage into Redux
  useEffect(() => {
    try {
      const storedAgent = localStorage.getItem('CurrentAiAgent');
      if (storedAgent) {
        dispatch(setAgent(JSON.parse(storedAgent)));
      }
    } catch (e) {
      console.error("Failed to parse AI agent from localStorage", e);
    }
  }, [dispatch]);

  // Whenever the agent changes in Redux, update localStorage
// ... existing imports
  useEffect(() => {
    if (agent && provider) {
      // We save to localStorage so the UI stays green even if the page refreshes 
      // before the next global state fetch.
      localStorage.setItem('CurrentAiAgent', JSON.stringify({ 
        provider, 
        model: agent, 
        ApiKey: apiKey 
      }));
    } else if (loading === 'succeeded' && !agent) {
       // Only remove if we explicitly cleared it, not during initial idle state
       localStorage.removeItem('CurrentAiAgent');
    }
  }, [agent, provider, apiKey, loading]);
  
  return null; // This component does not render anything
}