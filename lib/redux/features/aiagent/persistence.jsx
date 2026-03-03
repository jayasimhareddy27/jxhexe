'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectAiAgent } from './thunks';

export default function AIAgentPersistence() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Automatically check for Chrome AI readiness on startup
    dispatch(connectAiAgent());
  }, [dispatch]);

  return null;
}