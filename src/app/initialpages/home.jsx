import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

// Redux Thunks & Actions
import { initializeScraperDataThunk, runExtractionPipelineThunk } from "../../../lib/redux/features/scraper/thunks";
import { 
  setExtractionState, 
  setIsTailoringResume, 
  setIsGeneratingCoverLetter, 
  setIsGeneratingQA, 
  setAiStatus 
} from "../../../lib/redux/features/scraper/slice";

// Tab Components
import ScrapeTab from '../tabs/scraper/scrapetab';
import AutoFillPanel from '../tabs/autofill/autofilltab';
import ProfileTab from '../tabs/profile/profiletab';
import ResumeTab from '../tabs/resume/resumetab';
import { CoverletterTab } from '../tabs/coverletter/coverlettertab';
import { QATab } from '../tabs/q_a/qatab';
import AIConnectionFloating from "../../../public/components/loadingutils/aiconnection";

export default function Homepage() {
  const [activeTab, setActiveTab] = useState(1);
  const dispatch = useDispatch();

  // 1. SAFELY STORE CONTROLLERS HERE
  // Because Homepage never unmounts, these refs (and their background tasks) survive tab switches!
  const scrapeAbortRef = useRef(null);
  const resumeAbortRef = useRef(null);

  // Grab the specific states needed to know if we should auto-start the scraper
  const { hasScraped, isExtracting } = useSelector(state => state.scraper, shallowEqual);

  // 2. Initialize Data & Smart-Start Scraping
  useEffect(() => {
    // Sync cloud data and session storage on initial load
    dispatch(initializeScraperDataThunk());

    // Smart start: Only run the background scraper if we haven't scraped yet this session
    if (!hasScraped && !isExtracting) {
      scrapeAbortRef.current = new AbortController();
      dispatch(setExtractionState({ hasScraped: true }));
      dispatch(runExtractionPipelineThunk(scrapeAbortRef.current.signal));
    }
  }, [dispatch, hasScraped, isExtracting]);

  // 3. THE UNIVERSAL KILL SWITCH
  // Kills all ongoing background fetches and resets all Redux loading states
  const handleGlobalStop = () => {
    // Kill the actual network requests
    if (scrapeAbortRef.current) scrapeAbortRef.current.abort();
    if (resumeAbortRef.current) resumeAbortRef.current.abort();
    
    // Reset all Redux UI locking states instantly
    dispatch(setExtractionState({ 
      isExtracting: false, 
      isLazyLoading: false, 
      isSyncing: false 
    }));
    dispatch(setIsTailoringResume(false));
    dispatch(setIsGeneratingCoverLetter(false));
    dispatch(setIsGeneratingQA(false));
    dispatch(setAiStatus({ active: false, message: "" }));
  };

  // 4. Pass the refs and the global stop function down to the tabs that need them
  const tabs = [
    { 
      id: 1, 
      label: 'Scrape', 
      component: <ScrapeTab abortRef={scrapeAbortRef} handleStop={handleGlobalStop} /> 
    },

    { 
      id: 4, 
      label: 'Resume', 
      component: <ResumeTab abortRef={resumeAbortRef} handleStop={handleGlobalStop} /> 
    },
    { 
      id: 5, 
      label: 'Cover Letter', 
      // Cover Letter doesn't have an abortRef right now, but it still gets the global stop!
      component: <CoverletterTab handleStop={handleGlobalStop} /> 
    },
    { 
      id: 6, 
      label: 'Q&A', 
      component: <QATab handleStop={handleGlobalStop} /> 
    },
        { 
      id: 2, 
      label: 'Autofill', 
      component: <AutoFillPanel /> 
    },
    { 
      id: 3, 
      label: 'Profile', 
      component: <ProfileTab /> 
    },
  ];

  return (
    <>

    <div className="flex flex-col h-screen p-1 w-full bg-[var(--color-background-primary)] font-sans overflow-hidden">
      <nav className="flex w-full bg-[var(--color-background-secondary)] shrink-0 shadow-sm border-b border-[var(--color-border-primary)]">
        <ul className="grid grid-cols-3 w-full list-none p-0 m-0 ">
          {tabs.map((tab) => (
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

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--color-background-primary)]">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </main>
<div className="absolute bottom-24 right-5 z-[9999]">
        <AIConnectionFloating/> 
      </div>
      
    </div>
    </>
  );
}