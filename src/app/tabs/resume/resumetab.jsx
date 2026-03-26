import React, { useEffect, useState, useCallback, useRef } from "react"; // Added useRef
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Loader2, Wand2, FileBadge, Save } from "lucide-react";
import { setAiStatus, updateJobData } from "../../../../lib/redux/features/scraper/slice";
import { fetchAIdataforDocument, fetchDocumentById, saveDocumentById } from "../../../../lib/redux/features/editor/thunks";
import { fetchResumes } from "../../../../lib/redux/features/resumes/resumecrud/thunks"; // Added this import

import { ExtractionHeader } from "../../../../public/components/loadingutils/utils";
import DetailsTab from "../../../../public/components/shared/details";
import { Companybackend } from "../../../globalvar/companydetails";

export default function ResumeTab({ abortRef, handleStop }) {
  const dispatch = useDispatch();
  const skipNextFetchRef = useRef(false); // Shield to prevent "The Blink"

  const { allResumes, primaryResumeId } = useSelector(state => state.resumecrud, shallowEqual);
  const { jobData, isTailoringResume, isGeneratingCoverLetter, isGeneratingQA } = useSelector(state => state.scraper, shallowEqual);
  const { loading: editorLoading } = useSelector(state => state.editor, shallowEqual);
  const { token } = useSelector((state) => ({ token: state.auth.token }), shallowEqual);

  const isAIBusy = isTailoringResume || isGeneratingCoverLetter || isGeneratingQA;

  const [expandedPhase, setExpandedPhase] = useState(null);
  const toggleAccordion = (phaseKey) => setExpandedPhase((prev) => (prev === phaseKey ? null : phaseKey));

  // 1. AUTOMATIC FETCH (Standard selection)
  useEffect(() => {
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    if (jobData.resumeId && !isTailoringResume) {
      dispatch(fetchDocumentById({ id: jobData.resumeId, type: "resume" }));
    }
  }, [dispatch, jobData.resumeId, isTailoringResume]);

  const handleSaveDocument = () => dispatch(saveDocumentById());

  // 2. REFACETORED COPY LOGIC
  const CreatenewResume = async () => {
    const targetResumeId = jobData.resumeId || primaryResumeId;
    if (!targetResumeId) throw new Error("No base resume found to copy");

    dispatch(setAiStatus({ active: true, message: "Creating resume copy..." }));

    const copyResponse = await fetch(`${Companybackend}resume/copy`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({   resumeId: targetResumeId,   newName: `${jobData.companyName}_${jobData.position}` }),
    });

    if (!copyResponse.ok) throw new Error("Failed to copy resume");
    
    const { newResume } = await copyResponse.json();

    dispatch(updateJobData({ resumeId: newResume._id }));
    await dispatch(fetchResumes()); 
    await dispatch(fetchDocumentById({ id: newResume._id, type: "resume" })).unwrap();
    
    return newResume;
  };

  const handleTailor = useCallback(async () => {
    abortRef.current = new AbortController();
    skipNextFetchRef.current = true; // Set shield

    try {
      const newResume = await CreatenewResume();
      const sectionIds = [6,8]; 
      await dispatch(fetchAIdataforDocument({type: "resume",sectionIds,token,phase: { key: "full_tailor", title: "Full Resume" },signal: abortRef.current.signal,})).unwrap();
      await dispatch(saveDocumentById()).unwrap();
    } catch (error) {
      console.error("Tailoring Flow Failed:", error);
      skipNextFetchRef.current = false;
      dispatch(setAiStatus({ active: false, message: "" }));
    }
  }, [dispatch, token, jobData, allResumes, primaryResumeId]);


  const handleFetchFromAI = useCallback(async (phase) => {
    abortRef.current = new AbortController();
    skipNextFetchRef.current = true;
    
    await dispatch(fetchAIdataforDocument({  type: "resume",  sectionIds: [phase.id],  token,  phase,  signal: abortRef.current.signal,})).unwrap();
  }, [dispatch, token]);

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 space-y-4 pb-32 overflow-y-auto custom-scrollbar">
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
                  value={jobData.resumeId || ""}
                  onChange={(e) => dispatch(updateJobData({ resumeId: e.target.value }))}
                >
                  <option value="" disabled>No Resume Linked...</option>
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
                  ? 'bg-[var(--color-button-primary-active-bg)] text-[var(--color-text-on-primary)] shadow-inner' 
                  : 'bg-[var(--color-button-primary-bg)] text-[var(--color-text-on-primary)] hover:bg-[var(--color-button-primary-hover-bg)]'
              } ${isAIBusy && !isTailoringResume ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleTailor}
              disabled={isAIBusy || (!jobData.resumeId && !primaryResumeId)}
            >
              {isTailoringResume ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {jobData.resumeId && (
          <div className="pt-4 border-t border-[var(--color-border-primary)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-[var(--color-text-primary)] uppercase tracking-widest">Resume Editor</h3>
              <button 
                onClick={handleSaveDocument}
                disabled={editorLoading === "loading" || isTailoringResume}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-[var(--color-button-secondary-bg)] text-[var(--color-button-primary-bg)] rounded-md transition-opacity disabled:opacity-50"
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