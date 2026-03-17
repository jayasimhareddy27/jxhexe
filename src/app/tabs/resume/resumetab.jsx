import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Loader2, Wand2, FileBadge, Save } from "lucide-react";
// Redux Actions & Slices
import { updateJobData } from "../../../../lib/redux/features/scraper/slice";
import { fetchAIdataforDocument, fetchDocumentById, saveDocumentById } from "../../../../lib/redux/features/editor/thunks"; // Adjust path!

// Components
import { ExtractionHeader } from "../../../../public/components/loadingutils/utils";
import DetailsTab from "../../../../public/components/shared/details";

export default function ResumeTab({ abortRef, handleStop }) {
  const dispatch = useDispatch();

  // 1. Pull Resumes, Scraper Data, and Editor Loading State
  const { allResumes, primaryResumeId } = useSelector(state => state.resumecrud, shallowEqual);
  const { jobData, isTailoringResume, isGeneratingCoverLetter, isGeneratingQA } = useSelector(state => state.scraper, shallowEqual);
  const { loading: editorLoading } = useSelector(state => state.editor, shallowEqual);
   const { formDataMap, token } = useSelector((state) => ({
    formDataMap: state.editor.formDataMap,
    token: state.auth.token,
  }), shallowEqual);

  const isAIBusy = isTailoringResume || isGeneratingCoverLetter || isGeneratingQA;

  // 2. Accordion State for DetailsTab
  const [expandedPhase, setExpandedPhase] = useState(null);
  const toggleAccordion = (phaseKey) => {
    setExpandedPhase((prev) => (prev === phaseKey ? null : phaseKey));
  };

  // 3. AUTOMATIC FETCH: Whenever the resumeId changes (manual select OR AI finishes), fetch the full doc!
  useEffect(() => {
    if (jobData.resumeId) {
      dispatch(fetchDocumentById({ id: jobData.resumeId, type: "resume" }));
    }
  }, [dispatch, jobData.resumeId]);


  const handleSaveDocument = () => {
    dispatch(saveDocumentById());
  };

// For the main "Tailor" button
const handleTailor = useCallback(async () => {
  abortRef.current = new AbortController();
  const phase = { key: "full_tailor", title: "Full Resume" }; // Key used for identification
  const sectionIds = [8]; 

  await dispatch(fetchAIdataforDocument({
    type: "resume",
    sectionIds,
    token,
    phase,
    signal: abortRef.current.signal,
  })).unwrap();
}, [dispatch, token]);

// For the specific accordion sections (DetailsTab)
const handleFetchFromAI = useCallback(async (phase) => {
  abortRef.current = new AbortController();
  await dispatch(fetchAIdataforDocument({
    type: "resume",
    sectionIds: [phase.id],
    token,
    phase,
    signal: abortRef.current.signal,
  })).unwrap();
}, [dispatch, token]);

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 space-y-4 pb-32 overflow-y-auto custom-scrollbar">
        
        {/* TOP CONTROLS: Select & Tailor */}
        <div>
          <h2 className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-2">Target Resume</h2>
          <div className="flex gap-2.5">
            <div className="flex-1 bg-[var(--color-card-bg)] border border-[var(--color-border-primary)] rounded-2xl shadow-sm flex items-center transition-all duration-300 focus-within:ring-2 focus-within:ring-[var(--color-form-focus-ring)]">
              <div className={`p-2.5 m-1.5 rounded-xl transition-colors ${jobData.resumeId ? 'bg-[var(--color-button-secondary-bg)] text-[var(--color-button-primary-bg)]' : 'bg-[var(--color-background-tertiary)] text-[var(--color-text-placeholder)]'}`}>
                <FileBadge size={18} strokeWidth={2.5} />
              </div>
              <div className="flex-1 py-1.5 pr-3">
                <label className="text-[9px] font-bold text-[var(--color-text-placeholder)] uppercase tracking-widest mb-0.5 block">Select Document</label>
                <select 
                  className="w-full text-[13px] font-semibold outline-none bg-transparent text-[var(--color-text-primary)] cursor-pointer"
                  value={jobData.resumeId}
                  onChange={(e) => dispatch(updateJobData({ resumeId: e.target.value }))}
                >
                  <option value="" className="text-[var(--color-text-placeholder)]">No Resume Linked...</option>
                  {allResumes.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.name} {r._id === primaryResumeId ? "⭐️" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              className={`w-14 rounded-2xl border flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm ${
                isTailoringResume 
                  ? 'bg-[var(--color-button-primary-active-bg)] text-[var(--color-text-on-primary)] shadow-inner border-[var(--color-button-primary-active-bg)]' 
                  : 'bg-[var(--color-button-primary-bg)] text-[var(--color-text-on-primary)] border-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover-bg)]'
              } ${isAIBusy && !isTailoringResume ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              onClick={handleTailor}
              disabled={isAIBusy || !jobData.resumeId}
              title={isAIBusy && !isTailoringResume ? "AI is currently busy on another tab" : "Tailor Resume with AI"}
            >
              {isTailoringResume ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* DYNAMIC EDITOR: Renders the document details once loaded */}
        {jobData.resumeId && (
          <div className="pt-4 border-t border-[var(--color-border-primary)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-[var(--color-text-primary)] uppercase tracking-widest">Resume Editor</h3>
              
              {/* Added a quick save button specifically for the editor */}
              <button 
                onClick={handleSaveDocument}
                disabled={editorLoading === "loading" || isTailoringResume}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-[var(--color-button-secondary-bg)] text-[var(--color-button-primary-bg)] hover:opacity-80 rounded-md transition-opacity disabled:opacity-50"
              >
                {editorLoading === "loading" ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                Save Edits
              </button>
            </div>

            {editorLoading === "loading" && !isTailoringResume ? (
              <div className="flex flex-col items-center justify-center py-10 text-[var(--color-text-placeholder)]">
                <Loader2 size={24} className="animate-spin mb-2 text-[var(--color-button-primary-bg)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Loading Document...</span>
              </div>
            ) : (
              <DetailsTab 
                type="resume"
                expandedPhase={expandedPhase}
                toggleAccordion={toggleAccordion}
                handleFetchFromAI={handleFetchFromAI}
                handleSave={handleSaveDocument}
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