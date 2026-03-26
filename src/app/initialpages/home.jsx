'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { initializeScraperDataThunk, runExtractionPipelineThunk } from "../../../lib/redux/features/scraper/thunks";
import { setExtractionState, setIsTailoringResume, setIsGeneratingCoverLetter, setIsGeneratingQA, setAiStatus } from "../../../lib/redux/features/scraper/slice";

import ScrapeTab from '../tabs/scraper/scrapetab';
import AutoFillPanel from '../tabs/autofill/autofilltab';
import ProfileTab from '../tabs/profile/profiletab';
import ResumeTab from '../tabs/resume/resumetab';
import CoverletterTab  from '../tabs/coverletter/coverlettertab';
import { QATab } from '../tabs/q_a/qatab';
import AIConnectionFloating from "../../../public/components/loadingutils/aiconnection";
import SettingsPage from '../../../public/components/loadingutils/aisettings';

export default function Homepage() {
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();

  // 1. Create Refs for ALL tabs that perform AI/Async work
  const scrapeAbortRef = useRef(null);
  const resumeAbortRef = useRef(null);
  const clAbortRef = useRef(null); // New
  const qaAbortRef = useRef(null); // New

  const { hasScraped, isExtracting } = useSelector(state => state.scraper, shallowEqual);

  useEffect(() => {
    dispatch(initializeScraperDataThunk());

    if (!hasScraped && !isExtracting) {
      scrapeAbortRef.current = new AbortController();
      dispatch(setExtractionState({ hasScraped: true }));
      dispatch(runExtractionPipelineThunk(scrapeAbortRef.current.signal));
    }
  }, [dispatch, hasScraped, isExtracting]);

  // 2. Updated Global Stop to handle all new refs
  const handleGlobalStop = () => {
    if (scrapeAbortRef.current) scrapeAbortRef.current.abort();
    if (resumeAbortRef.current) resumeAbortRef.current.abort();
    if (clAbortRef.current) clAbortRef.current.abort();
    if (qaAbortRef.current) qaAbortRef.current.abort();
    
    dispatch(setExtractionState({ isExtracting: false, isLazyLoading: false, isSyncing: false }));
    dispatch(setIsTailoringResume(false));
    dispatch(setIsGeneratingCoverLetter(false));
    dispatch(setIsGeneratingQA(false));
    dispatch(setAiStatus({ active: false, message: "" }));
  };

  // 3. Pass the correct refs to the components
  const tabs = [
    { id: 1, label: 'Scrape', component: <ScrapeTab abortRef={scrapeAbortRef} handleStop={handleGlobalStop} /> },
    { id: 2, label: 'Resume', component: <ResumeTab abortRef={resumeAbortRef} handleStop={handleGlobalStop} /> },
    { id: 3, label: 'Cover Letter', component: <CoverletterTab abortRef={clAbortRef} handleStop={handleGlobalStop} /> },
    { id: 4, label: 'Q&A', component: <QATab abortRef={qaAbortRef} handleStop={handleGlobalStop} /> },
    { id: 5, label: 'Autofill', component: <AutoFillPanel /> },
    { id: 6, label: 'Profile', component: <ProfileTab /> },
    { id: 7, label: 'Settings', component: <SettingsPage onBack={() => setActiveTab(1)} /> },
  ];

  return (
    <div className="relative flex flex-col h-screen p-1 w-full bg-[var(--color-background-primary)] font-sans overflow-hidden">
      
      {/* Navigation */}
      <nav className="flex w-full bg-[var(--color-background-secondary)] shrink-0 shadow-sm border-b border-[var(--color-border-primary)]">
        <ul className="grid grid-cols-3 w-full list-none p-0 m-0">
          {tabs.filter(tab => tab.id !== 7).map((tab) => (
            <li key={tab.id} className="flex-1">
              <button 
                onClick={() => setActiveTab(tab.id)}
                className={`nav-link w-full justify-center py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className='absolute bottom-28 right-10 z-20'>
        <AIConnectionFloating setActiveTab={setActiveTab} /> 
      </div>    

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--color-background-primary)]">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </main>
      
    </div>
  );
}