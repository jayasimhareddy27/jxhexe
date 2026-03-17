import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Save, Loader2 } from "lucide-react";

import { Scrapedjobheader } from "./metadata";
import { ExtractionHeader } from "../../../../public/components/loadingutils/utils";

// Redux Actions
import { runExtractionPipelineThunk } from "../../../../lib/redux/features/scraper/thunks";
import { setExtractionState } from "../../../../lib/redux/features/scraper/slice";
import { createJob } from "../../../../lib/redux/features/job/thunks";
import { displayToast } from "../../../../lib/redux/features/toast/thunks";

export default function ScrapeTab() {
  const dispatch = useDispatch();
  const extractAbortControllerRef = useRef(null);

  // 1. Pull Scraper Data AND Job Saving Loading State
  const { isExtracting, isLazyLoading, isSyncing, jobData, flashDeepData } = useSelector(state => state.scraper, shallowEqual);
  const { loading } = useSelector((state) => state.jobsStore, shallowEqual);
  
  // 2. SMART EFFECT: Listen for Navigation AND Tab Switching
  useEffect(() => {
    let isMounted = true;

    const checkUrlAndScrape = async () => {
      if (typeof chrome === "undefined" || !chrome.tabs) return;

      try {
        // Get the current active tab in Chrome
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTabUrl = tab?.url || "";

        // Stop if it's the exact same job URL we already have, or an invalid page (like chrome:// settings)
        if (!currentTabUrl || currentTabUrl === jobData.jobUrl || currentTabUrl.startsWith('chrome://')) {
          return; 
        }

        // If it's a completely new URL, abort any stuck scrapes and run the pipeline
        if (isMounted) {
          if (extractAbortControllerRef.current) extractAbortControllerRef.current.abort();
          extractAbortControllerRef.current = new AbortController();
          dispatch(runExtractionPipelineThunk(extractAbortControllerRef.current.signal));
        }
      } catch (error) {
        console.error("Error checking tab URL:", error);
      }
    };

    // Run immediately on mount
    checkUrlAndScrape();

    // Listener 1: Fires when a page finishes loading or URL changes within the SAME tab
    const handleTabUpdate = (tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.active) {
        checkUrlAndScrape();
      }
    };

    // Listener 2: Fires when the user SWITCHES to a completely different tab
    const handleTabActivated = (activeInfo) => {
      checkUrlAndScrape();
    };

    // Attach both listeners to Chrome
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.onUpdated.addListener(handleTabUpdate);
      chrome.tabs.onActivated.addListener(handleTabActivated);
    }

    // Cleanup: Remove listeners and abort fetch if the component unmounts
    return () => {
      isMounted = false;
      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.onUpdated.removeListener(handleTabUpdate);
        chrome.tabs.onActivated.removeListener(handleTabActivated);
      }
      extractAbortControllerRef.current?.abort();
    };
  }, [dispatch, jobData.jobUrl]); // Re-runs safety check if Redux jobUrl updates

  // 3. Handlers
  const handleStop = () => {
    if (extractAbortControllerRef.current) extractAbortControllerRef.current.abort();
    dispatch(setExtractionState({ isExtracting: false, isLazyLoading: false }));
  };

  const handleRefresh = async () => {
    handleStop();
    extractAbortControllerRef.current = new AbortController();
    dispatch(runExtractionPipelineThunk(extractAbortControllerRef.current.signal));
  };

  // 4. The Save Logic
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 
    const { minSalary, maxSalary, currency, period, ...restOfJobData } = jobData;
    
    // Format the salary string safely
    const salary = (minSalary && maxSalary) 
      ? (`${minSalary}-${maxSalary} ${currency}/${period}`) 
      : (minSalary ? (`${minSalary} ${currency}/${period}`) 
      : maxSalary ? (`Up to ${maxSalary} ${currency}/${period}`) 
      : "Not Mentioned");
    
    try {
      await dispatch(createJob({ 
        ...restOfJobData, 
        salary, 
        resumeId: restOfJobData.resumeId || null, 
        coverLetterId: restOfJobData.coverLetterId || null
      })).unwrap();
      
      dispatch(displayToast({ message: `Saved Successfully!`, type: 'success' }));
      setTimeout(() => window.close(), 1000); 
    } catch (error) {
      dispatch(displayToast({ message: "Save failed", type: 'error' }));
    }
  };

  const isAnyLoading = isExtracting || isLazyLoading;

  return (
    <div className="flex flex-col h-full relative">
      {/* Scrollable Content Area */}
      <div className="p-4 space-y-5 pb-40 custom-scrollbar overflow-y-auto">
        <Scrapedjobheader 
          jobData={jobData} 
          isAnyLoading={isAnyLoading} 
          flashDeepData={flashDeepData} 
          isLazyLoading={isLazyLoading} 
        />
      </div>

      {/* Fixed Bottom Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[var(--color-background-primary)] flex flex-col z-10">
        
        <ExtractionHeader 
          isAnyLoading={isAnyLoading} 
          isExtracting={isExtracting} 
          isLazyLoading={isLazyLoading} 
          isSyncing={isSyncing} 
          handleStop={handleStop} 
          handleGlobalRefresh={handleRefresh} 
        />

        {/* SAVE BUTTON */}
        <div className="px-4 pb-2 pt-2 bg-gradient-to-t from-[var(--color-background-primary)] to-transparent">
          <button 
            onClick={handleSubmit} 
            disabled={isAnyLoading || loading === 'pending'}  
            className="w-full py-3.5 bg-[var(--color-cta-bg)] hover:bg-[var(--color-cta-hover-bg)] text-[var(--color-cta-text)] rounded-xl font-bold text-[12px] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 shadow-md"
          >
            {loading === 'pending' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            SAVE JOB TO TRACKER
          </button>
        </div>

      </div>
    </div>
  );
}