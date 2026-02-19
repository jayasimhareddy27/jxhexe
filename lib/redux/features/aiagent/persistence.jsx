'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAgent } from './slice';

export default function AIAgentPersistence() {
  const dispatch = useDispatch();
  const { agent, provider, apiKey } = useSelector((state) => state.aiAgent);

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
  useEffect(() => {
    if (agent && provider) {
      localStorage.setItem('CurrentAiAgent', JSON.stringify({ provider, model: agent, ApiKey: apiKey }));
    } else {
      localStorage.removeItem('CurrentAiAgent');
    }
  }, [agent, provider, apiKey]);

  return null; // This component does not render anything
}