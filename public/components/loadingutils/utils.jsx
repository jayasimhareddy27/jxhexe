import {RefreshCw,Loader2, X,CheckCircle2  } from "lucide-react";
import { useSelector, shallowEqual } from 'react-redux';

export const ExtractionHeader = ({ handleStop, handleGlobalRefresh }) => {
  // 1. Pull EVERYTHING directly from Redux
  const { 
    isExtracting, isLazyLoading, isSyncing, 
    isTailoringResume, isGeneratingCoverLetter, isGeneratingQA, 
    aiStatus 
  } = useSelector(state => state.scraper, shallowEqual);

  // 2. Determine exactly what the AI or Scraper is doing
  let statusMessage = "Ready";
  let isActive = false;
  let isGlobalAIBusy = isTailoringResume || isGeneratingCoverLetter || isGeneratingQA;

  if (aiStatus?.active && aiStatus?.message) {
    statusMessage = aiStatus.message; 
    isActive = true;
  } else if (isExtracting) {
    statusMessage = "Scraping page data...";
    isActive = true;
  } else if (isLazyLoading) {
    statusMessage = "Analyzing deep job insights...";
    isActive = true;
  } else if (isGlobalAIBusy) {
    statusMessage = "AI is processing..."; 
    isActive = true;
  } else if (isSyncing) {
    statusMessage = "Syncing with cloud...";
    isActive = true;
  }

  // 3. Smart Stop Button Logic
  const isScraperTab = !!handleGlobalRefresh; 
  const showStopButton = handleStop && (
    (isScraperTab && (isExtracting || isLazyLoading || isSyncing)) ||
    (!isScraperTab && isGlobalAIBusy)
  );

  return (
    <div className="flex items-center justify-between p-3 bg-white border-y border-slate-200">
      
      {/* LEFT SIDE: Status Indicator */}
      <div className="flex items-center gap-2 overflow-hidden">
        {isActive ? (
          <Loader2 size={16} className="animate-spin text-slate-900 shrink-0" />
        ) : (
          <CheckCircle2 size={16} className="text-green-600 shrink-0" />
        )}
        
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider truncate">
          {statusMessage}
        </span>
      </div>

      {/* RIGHT SIDE: Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Stop Button */}
        {showStopButton && (
          <button 
            onClick={handleStop}
            className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-bold text-[10px] uppercase tracking-wider"
          >
            Stop
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
        
        {/* Refresh Button (Only on Scrape Tab when idle) */}
        {!isActive && isScraperTab && (
          <button 
            onClick={handleGlobalRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
      
    </div>
  );
}