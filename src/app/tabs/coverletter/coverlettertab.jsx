import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Loader2, Wand2, FileBadge, Save } from "lucide-react";

// Redux Actions & Slices
import { updateJobData } from "../../../../lib/redux/features/scraper/slice";
import { fetchAIdataforDocument, fetchDocumentById, saveDocumentById } from "../../../../lib/redux/features/editor/thunks";
import { fetchCoverletters } from "../../../../lib/redux/features/coverletter/coverlettercrud/thunks"; // Adjusted import

// Components
import { ExtractionHeader } from "../../../../public/components/loadingutils/utils";
import DetailsTab from "../../../../public/components/shared/details";
import { Companybackend } from "../../../globalvar/companydetails";

export default function CoverletterTab({ abortRef, handleStop }) {
  const dispatch = useDispatch();
  const skipNextFetchRef = useRef(false);

  // 1. Pull Cover Letter Data instead of Resumes
  const { allCoverletters } = useSelector(state => state.coverlettercrud, shallowEqual);
  const { jobData, isGeneratingCoverLetter, isAIBusy: scraperBusy } = useSelector(state => state.scraper, shallowEqual);
  const { loading: editorLoading } = useSelector(state => state.editor, shallowEqual);
  const { token } = useSelector((state) => ({ token: state.auth.token }), shallowEqual);

  // Logic to determine if AI is busy
  const isAIBusy = isGeneratingCoverLetter || scraperBusy;

  const [expandedPhase, setExpandedPhase] = useState(null);
  const toggleAccordion = (phaseKey) => setExpandedPhase((prev) => (prev === phaseKey ? null : phaseKey));

  // 1. AUTOMATIC FETCH (Standard selection)
  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    // Fetch Cover Letter type document
    if (jobData.coverLetterId && !isGeneratingCoverLetter) {
      dispatch(fetchDocumentById({ id: jobData.coverLetterId, type: "coverletter" }));
    }
  }, [dispatch, jobData.coverLetterId, isGeneratingCoverLetter]);

  const handleSaveDocument = () => dispatch(saveDocumentById());

  // 2. REFACTORED COPY/CREATE LOGIC for Cover Letters
  const CreatenewCoverLetter = async () => {
    const targetCLId = jobData.coverLetterId || (allCoverletters[0]?._id);
    dispatch({ type: 'scraper/setAiStatus', payload: { active: true, message: "Generating new cover letter..." }});

    // Note: Ensure your backend has a /coverletter/copy or /coverletter/generate endpoint
    const response = await fetch(`${Companybackend}coverletter/copy`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        coverletterId: targetCLId, 
        newName: `${jobData.companyName}_${jobData.position}` 
      }),
    });

    if (!response.ok) throw new Error("Failed to create cover letter");
    
    const { newCoverletter } = await response.json();

    dispatch(updateJobData({ coverLetterId: newCoverletter._id }));
    await dispatch(fetchCoverletters()); 
    await dispatch(fetchDocumentById({ id: newCoverletter._id, type: "coverletter" })).unwrap();
    
    return newCoverletter;
  };

  const handleTailor = useCallback(async () => {
    abortRef.current = new AbortController();
    skipNextFetchRef.current = true; 

    try {
      const newCL = await CreatenewCoverLetter();
      
      // sectionIds for Cover Letters usually differ (e.g., Intro, Body, Conclusion)
      const sectionIds = [5]; 

      await dispatch(fetchAIdataforDocument({
        type: "coverletter",
        sectionIds,
        token,
        signal: abortRef.current.signal,
      })).unwrap();

      await dispatch(saveDocumentById()).unwrap();
    } catch (error) {
      console.error("Cover Letter Generation Failed:", error);
      skipNextFetchRef.current = false;
      dispatch({ type: 'scraper/setAiStatus', payload: { active: false, message: "" }});
    }
  }, [dispatch, token, jobData, allCoverletters]);

  const handleFetchFromAI = useCallback(async (phase) => {
    abortRef.current = new AbortController();
    skipNextFetchRef.current = true;
    
    await dispatch(fetchAIdataforDocument({ 
      type: "coverletter", 
      sectionIds: [phase.id], 
      token, 
      phase, 
      signal: abortRef.current.signal,
    })).unwrap();
  }, [dispatch, token]);

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 space-y-4 pb-32 overflow-y-auto custom-scrollbar">
        <div>
          <h2 className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-2">Target Cover Letter</h2>
          <div className="flex gap-2.5">
            <div className="flex-1 bg-[var(--color-card-bg)] border border-[var(--color-border-primary)] rounded-2xl shadow-sm flex items-center transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--color-form-focus-ring)]">
              <div className={`p-2.5 m-1.5 rounded-xl transition-colors ${jobData.coverLetterId ? 'bg-orange-100 text-orange-600' : 'bg-[var(--color-background-tertiary)] text-[var(--color-text-placeholder)]'}`}>
                <FileBadge size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 py-1.5 pr-3">
                <label className="text-[9px] font-bold text-[var(--color-text-placeholder)] uppercase tracking-widest mb-0.5 block">Select Document</label>
                <select 
                  className="w-full text-[13px] font-semibold outline-none bg-transparent text-[var(--color-text-primary)] cursor-pointer"
                  value={jobData.coverLetterId || ""}
                  onChange={(e) => dispatch(updateJobData({ coverLetterId: e.target.value }))}
                >
                  <option value="" disabled>Select a Cover Letter...</option>
                  {allCoverletters.map(cl => (
                    <option key={cl._id} value={cl._id}>
                      {cl.name || "Untitled Cover Letter"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              className={`w-14 rounded-2xl border flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm ${
                isGeneratingCoverLetter 
                  ? 'bg-orange-500 text-white shadow-inner' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              } ${isAIBusy && !isGeneratingCoverLetter ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleTailor}
              disabled={isAIBusy}
            >
              {isGeneratingCoverLetter ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {jobData.coverLetterId && (
          <div className="pt-4 border-t border-[var(--color-border-primary)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-[var(--color-text-primary)] uppercase tracking-widest">Cover Letter Editor</h3>
              <button 
                onClick={handleSaveDocument}
                disabled={editorLoading === "loading" || isGeneratingCoverLetter}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-[var(--color-button-secondary-bg)] text-[var(--color-button-primary-bg)] rounded-md transition-opacity disabled:opacity-50"
              >
                {editorLoading === "loading" ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                Save Edits
              </button>
            </div>

            {editorLoading === "loading" && !isGeneratingCoverLetter ? (
              <div className="flex flex-col items-center justify-center py-10 text-[var(--color-text-placeholder)]">
                <Loader2 size={24} className="animate-spin mb-2 text-orange-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Loading Document...</span>
              </div>
            ) : (
              <DetailsTab 
                type="coverletter"
                expandedPhase={expandedPhase}
                toggleAccordion={toggleAccordion}
                handleFetchFromAI={handleFetchFromAI}
              />
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full z-10 bg-[var(--color-background-primary)]">
        <ExtractionHeader handleStop={handleStop} />
      </div>
    </div>
  );
}