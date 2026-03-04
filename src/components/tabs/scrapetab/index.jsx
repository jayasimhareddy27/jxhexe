"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { createJob } from "../../../../lib/redux/features/job/thunks";
import { sanitizeJobData } from "../../../../lib/redux/features/job/index"; 
import { displayToast } from "../../../../lib/redux/features/toast/thunks";
import { executeJobDiscovery } from "../../jobextractionutils/jobservice";
import { lazyDescriptionExtractor, analyzeJobInsights } from "../../jobextractionutils/utils"; 
import { Save, Loader2, MapPin, DollarSign, ClipboardList, RefreshCw, Square, Zap, Info, Calendar, Briefcase, Star, FileText, Wand2, Target, BookmarkCheck} from "lucide-react";
import { fetchCoverletters } from "../../../../lib/redux/features/coverletter/coverlettercrud/thunks";
import { fetchResumes } from "../../../../lib/redux/features/resumes/resumecrud/thunks";
import { fetchDocumentById } from "../../../../lib/redux/features/editor/thunks";
import { INITIAL_JOB_STATE } from "./utils";
import { generatecoverletterfromjobdata } from "../../../components/generate/coverletter/generatecoverletterfromjobdata";
import { generateresumefromjobdata } from "../../../components/generate/resume/generateresumefromjobdata";

export default function CreateJobPage() {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);
  const abortControllerRef = useRef(null);

  // --- REDUX DATA ---
  const { allResumes, myProfileRef, allCoverletters, loading, aiAgent } = useSelector((state) => ({
    allResumes: state.resumecrud?.allResumes || [],
    myProfileRef: state.resumecrud?.myProfileRef,
    allCoverletters: state.coverlettercrud?.allCoverletters || [],
    loading: state.jobsStore.loading, aiAgent: state.aiAgent
    }), shallowEqual);
  // --- UI & EXTRACTION STATE ---
  const [isExtracting, setIsExtracting] = useState(false);
  const [isLazyLoading, setIsLazyLoading] = useState(false);
  const [flashDeepData, setFlashDeepData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [aiStatus, setAiStatus] = useState({ active: false, message: "" });

  const [jobData, setJobData] = useState(() => {
    if (typeof window !== "undefined") {
      const savedResume = sessionStorage.getItem("selected_resume_id");
      const savedCL = sessionStorage.getItem("selected_cl_id");
      return {   ...INITIAL_JOB_STATE,   resumeId: savedResume || "",   coverLetterId: savedCL || "" };
    }
    return INITIAL_JOB_STATE;
  });
  useEffect(() => {
    sessionStorage.setItem("selected_resume_id", jobData.resumeId);
    sessionStorage.setItem("selected_cl_id", jobData.coverLetterId);
  }, [jobData.resumeId, jobData.coverLetterId]);

  const refreshAllData = useCallback(async () => {
    try {
      setIsSyncing(true);
      // Re-fetch all document lists
      await Promise.all([
        dispatch(fetchCoverletters()).unwrap(),
        dispatch(fetchResumes()).unwrap()
      ]);

      dispatch(displayToast({ message: "Cloud Data Synced", type: 'success' }));
    } catch (error) {
      dispatch(displayToast({ message: "Sync failed", type: 'error' }));
    } finally {
      setIsSyncing(false);
    }
  }, [dispatch]);

  // 2. Initial Data Load
  useEffect(() => {
    refreshAllData();
  }, []);

  // 3. Document Content Fetching (when myProfileRef is discovered/updated)
  useEffect(() => {
    if (myProfileRef) {
      dispatch(fetchDocumentById({ id: myProfileRef , type: 'resume' }));
      // Auto-select the primary resume if nothing is selected yet
      if (!jobData.resumeId) {
        setJobData(prev => ({ ...prev, resumeId: myProfileRef }));
      }
    }
  }, [dispatch, myProfileRef]);

  // AI Pipeline Logic
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsExtracting(false);
      setIsLazyLoading(false);
      dispatch(displayToast({ message: "Extraction stopped", type: 'info' }));
    }
  };

  const initPipeline = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      setIsExtracting(true);
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id || signal.aborted) return;

      const payload = await executeJobDiscovery(tab);
      if (signal.aborted) return;
      const sanitized = sanitizeJobData(payload);

      setJobData(prev => ({ ...prev, ...sanitized, resumeId: prev.resumeId }));
      setIsExtracting(false);

      setIsLazyLoading(true);
      const [rewrittenDescription, insights] = await Promise.all([
        lazyDescriptionExtractor(tab, signal),
        analyzeJobInsights(tab, signal)
      ]);
      
      if (!signal.aborted) {
        setJobData(prev => ({ 
          ...prev, 
          rawDescription: rewrittenDescription || prev.rawDescription,
          seniorityLevel: insights?.seniorityLevel || prev.seniorityLevel,
          jobType: insights?.jobType || prev.jobType,
          postedDate: insights?.postedDate || prev.postedDate,
          businessModel: insights?.businessModel || prev.businessModel,
          companyInsights: insights?.companyInsights || prev.companyInsights,
          requirements: insights?.requirements || prev.requirements,
          perks: insights?.perks || prev.perks
        }));
        setFlashDeepData(true);
        setTimeout(() => setFlashDeepData(false), 800);
      }
      setIsLazyLoading(false);
    } catch (err) {
      if (err.name === 'AbortError') return;
      dispatch(displayToast({ message: "Extraction failed", type: 'error' }));
      setIsExtracting(false);
      setIsLazyLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hasInitialized.current && aiAgent) {
      initPipeline();
      hasInitialized.current = true;
    }
    return () => abortControllerRef.current?.abort();
  }, [aiAgent, initPipeline]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 
    const { minSalary, maxSalary, currency, period, ...restOfJobData } = jobData;
    const salary = (minSalary && maxSalary) ? (`${minSalary}-${maxSalary} ${currency}/${period}`) : (minSalary ? (`${minSalary} ${currency}/${period}`) : maxSalary ? (`Up to ${maxSalary} ${currency}/${period}`) : "Not Mentioned");
    try {
        const finalPayload = {
        ...restOfJobData,
        salary,
        resumeId: restOfJobData.resumeId || null,
        coverLetterId: restOfJobData.coverLetterId || null
        };
        
      await dispatch(createJob(finalPayload)).unwrap();
      dispatch(displayToast({ message: `Saved Successfully!`, type: 'success' }));
      setTimeout(() => window.close(), 1000); 
    } catch (error) {
      dispatch(displayToast({ message: "Save failed", type: 'error' }));
    }
  };

  const isAnyLoading = isExtracting || isLazyLoading;

  const handleTailorResume = async () => {
    if (!jobData.resumeId) {
      dispatch(displayToast({ message: "Select a resume first", type: 'info' }));
      return;
    }
    setAiStatus({ active: true, message: "Generating Tailored Resume Data..." });
    try {
      const selectedResume = allResumes.find(r => r._id === jobData.resumeId);
      const result = await generateresumefromjobdata(jobData, selectedResume)(); 
      if (result) {
        console.log("📂 TAILORED RESUME JSON:", result);
        dispatch(displayToast({ message: "Resume data logged to console", type: 'success' }));
      }
    } catch (err) {
      console.error("AI Resume Error:", err);
      dispatch(displayToast({ message: "Tailoring failed", type: 'error' }));
    } finally {
      setAiStatus({ active: false, message: "" });
    }
  };

  const handleTailorCoverLetter = async () => {
    setAiStatus({ active: true, message: "Generating Tailored Cover Letter..." });
    try {
      const generateTask = generatecoverletterfromjobdata(jobData);
      const result = await generateTask();
      
      console.log("✉️ TAILORED COVER LETTER JSON:", result);
      dispatch(displayToast({ message: "Cover letter logged to console", type: 'success' }));
    } catch (err) {
      console.error("AI Cover Letter Error:", err);
      dispatch(displayToast({ message: "Generation failed", type: 'error' }));
    } finally {
      setAiStatus({ active: false, message: "" });
    }
  };
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-slate-900 shadow-xl border-x border-slate-200">
      <main className="flex-1 overflow-y-auto p-4 space-y-5 pb-20 custom-scrollbar">
        
        {/* HEADER & ATS SCORE */}
        <section className="p-3 rounded-2xl border-2 border-slate-100 bg-slate-50/30 flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <input className="w-full text-lg font-black outline-none bg-transparent truncate" placeholder="Company" value={jobData.companyName} onChange={e => setJobData({...jobData, companyName: e.target.value})} />
            <input className="w-full text-xs font-bold text-indigo-600 outline-none uppercase tracking-tight bg-transparent truncate" placeholder="Position" value={jobData.position} onChange={e => setJobData({...jobData, position: e.target.value})} />
          </div>
          <div className="flex flex-col items-center justify-center px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl shrink-0">
             <div className="flex items-center gap-1 text-emerald-600">
                <Target size={14} className={isAnyLoading ? "animate-spin" : ""} />
                <span className="text-[14px] font-black leading-none">{jobData.resumeMatchScore}%</span>
             </div>
             <span className="text-[7px] font-bold text-emerald-700/60 uppercase tracking-tighter">ATS Score</span>
          </div>
        </section>

        {/* DOCUMENT SELECTION */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
               <BookmarkCheck size={12}/> Attach Documents
            </label>
            <button 
              onClick={refreshAllData}
              className="group flex items-center gap-1 p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-indigo-600"
              title="Sync with Website"
            >
              <span className="text-[8px] font-black">SYNC DATA</span>
              <RefreshCw size={10} className={isSyncing ? "animate-spin text-indigo-600" : "group-hover:rotate-180 transition-transform duration-500"} />
            </button>
          </div>
          
          <div className="space-y-2">
            {/* Resume Dropdown */}
            <div className="flex gap-2">
              <div className="flex-1 relative bg-slate-50 border border-slate-100 rounded-xl p-2 transition-all hover:border-indigo-200 focus-within:ring-1 focus-within:ring-indigo-100">
                <label className="text-[8px] font-black text-slate-400 block uppercase mb-1">Select Resume</label>
                <select 
                  className="w-full text-[11px] font-bold outline-none bg-transparent text-slate-700 cursor-pointer"
                  value={jobData.resumeId}
                  onChange={(e) => setJobData({...jobData, resumeId: e.target.value})}
                >
                  <option value="">No Resume Linked</option>
                  {allResumes.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.name} {r._id === myProfileRef ? "⭐️ (Primary)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button className="px-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 flex items-center justify-center active:scale-90 transition-transform" 
                onClick={handleTailorResume}>
                <Wand2 size={14} />
              </button>
            </div>

            {/* Cover Letter Dropdown */}
            <div className="flex gap-2">
              <div className="flex-1 relative bg-slate-50 border border-slate-100 rounded-xl p-2 transition-all hover:border-indigo-200 focus-within:ring-1 focus-within:ring-indigo-200">
                <label className="text-[8px] font-black text-slate-400 block uppercase mb-1">Select Cover Letter</label>
                <select 
                  className="w-full text-[11px] font-bold outline-none bg-transparent text-slate-700 cursor-pointer"
                  value={jobData.coverLetterId}
                  onChange={(e) => setJobData({...jobData, coverLetterId: e.target.value})}
                >
                  <option value="">No Cover Letter Linked</option>
                  {allCoverletters.map(c => <option key={c._id} value={c._id}>{c.name || c.title}</option>)}
                </select>
              </div>
              <button className="px-3 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 flex items-center justify-center active:scale-90 transition-transform"
                onClick={handleTailorCoverLetter}>
                                
                <FileText size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* INSIGHTS & METADATA */}
        <div className={`grid grid-cols-2 gap-2 transition-all duration-500 ${flashDeepData ? 'scale-[1.02]' : 'scale-100'}`}>
            <div className={`p-2 rounded-xl border transition-all ${flashDeepData ? 'border-indigo-400 bg-indigo-50 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                <label className="text-[8px] font-black text-slate-400 flex items-center gap-1 uppercase"><Zap size={8}/> Seniority</label>
                <select className="text-[10px] font-bold outline-none w-full bg-transparent text-slate-700 cursor-pointer" value={jobData.seniorityLevel} onChange={e => setJobData({...jobData, seniorityLevel: e.target.value})}>
                    <option value="">Select...</option>
                    {['Intern', 'Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Staff/Principal', 'Lead/Manager'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </div>
            <div className={`p-2 rounded-xl border transition-all ${flashDeepData ? 'border-indigo-400 bg-indigo-50 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                <label className="text-[8px] font-black text-slate-400 flex items-center gap-1 uppercase"><Briefcase size={8}/> Job Type</label>
                <select className="text-[10px] font-bold outline-none w-full bg-transparent text-slate-700 cursor-pointer" value={jobData.jobType} onChange={e => setJobData({...jobData, jobType: e.target.value})}>
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Not Mentioned'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </div>
        </div>

        {/* COMPENSATION SECTION */}
        <section className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><DollarSign size={12}/> Compensation</label>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <label className="text-[8px] font-black text-slate-400 block uppercase">Min</label>
              <input className="text-[11px] font-bold outline-none w-full bg-transparent" value={jobData.minSalary} onChange={e => setJobData({...jobData, minSalary: e.target.value})} />
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <label className="text-[8px] font-black text-slate-400 block uppercase">Max</label>
              <input className="text-[11px] font-bold outline-none w-full bg-transparent" value={jobData.maxSalary} onChange={e => setJobData({...jobData, maxSalary: e.target.value})} />
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-center">
               <label className="text-[8px] font-black text-slate-400 block uppercase">CCY</label>
               <select className="text-[10px] font-bold outline-none w-full bg-transparent" value={jobData.currency} onChange={e => setJobData({...jobData, currency: e.target.value})}>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex flex-col justify-center">
              <label className="text-[8px] font-black text-slate-400 block uppercase">Period</label>
              <select className="text-[10px] font-bold outline-none w-full bg-transparent" value={jobData.period} onChange={e => setJobData({...jobData, period: e.target.value})}>
                <option value="yearly">Year</option>
                <option value="monthly">Month</option>
              </select>
            </div>
          </div>
        </section>

        {/* DESCRIPTION AREA */}
        <section className="space-y-1.5 relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ClipboardList size={12}/> The Gist
              {isLazyLoading && <Loader2 size={10} className="animate-spin text-indigo-500 ml-auto" />}
          </label>
          <textarea 
              className={`w-full h-32 text-[12px] leading-relaxed text-slate-600 outline-none resize-none bg-slate-50 p-3 rounded-xl transition-all duration-500 
              ${isLazyLoading ? 'opacity-50' : 'opacity-100'}
              ${flashDeepData ? 'ring-2 ring-indigo-400 bg-indigo-50' : 'ring-0'}`} 
              value={jobData.rawDescription} 
              onChange={e => setJobData({...jobData, rawDescription: e.target.value})} 
          />
        </section>

        {/* FOOTER METADATA */}
        <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 p-2.5 rounded-xl flex items-center gap-2 border border-slate-100">
                <MapPin size={12} className="text-rose-500 shrink-0"/>
                <input className="text-[10px] font-bold outline-none w-full bg-transparent truncate" value={jobData.jobLocation} onChange={e => setJobData({...jobData, jobLocation: e.target.value})} />
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl flex items-center gap-2 border border-slate-100">
                <Calendar size={12} className="text-emerald-500 shrink-0"/>
                <input type="date" className="text-[10px] font-bold outline-none w-full bg-transparent" value={jobData.postedDate} onChange={e => setJobData({...jobData, postedDate: e.target.value})} />
            </div>
        </div>
      </main>

      <header className="p-4 border-b bg-slate-50/80 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-1.5">
          <div className={`h-1.5 w-1.5 rounded-full ${isAnyLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">
            {isExtracting ? "PASS 1: IDENTITY" : isLazyLoading ? "PASS 3: DEEP INSIGHTS" : "READY TO SAVE"}
          </span>
        </div>
        
        {isAnyLoading ? (
          <button onClick={handleStop} className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full transition-all group flex items-center gap-2 border border-rose-100">
            <Square size={12} fill="currentColor" />
            <span className="text-[9px] font-black hidden group-hover:inline">STOP</span>
          </button>
        ) : (
          <button onClick={initPipeline} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <RefreshCw size={14} />
          </button>
        )}
      </header>

      <footer className="p-4 bg-white border-t">
        <button onClick={handleSubmit} disabled={isAnyLoading || loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[12px] flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:bg-slate-200">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          SAVE JOB TO TRACKER
        </button>
      </footer>
    </div>
  );
}