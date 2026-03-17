import { Target, Zap, Briefcase, DollarSign, ClipboardList, Loader2, MapPin, Calendar } from "lucide-react";

export const Scrapedjobheader = ({ jobData, setJobData, isAnyLoading, flashDeepData, isLazyLoading }) => {
    return(<>
        <section className="p-3 rounded-2xl border-2 border-slate-100 bg-slate-50/30 flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <input className="w-full text-lg font-black outline-none bg-transparent truncate" placeholder="Company" value={jobData.companyName} onChange={e => setJobData({...jobData, companyName: e.target.value})} />
            <input className="w-full text-xs font-bold text-indigo-600 outline-none uppercase tracking-tight bg-transparent truncate" placeholder="Position" value={jobData.position} onChange={e => setJobData({...jobData, position: e.target.value})} />
          </div>
          <div className="flex flex-col items-center justify-center px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl shrink-0">
             <div className="flex items-center gap-1 text-emerald-600">
                <Target size={14} className={isAnyLoading ? "animate-spin" : ""} />
                <span className="text-[14px] font-black leading-none">{jobData.resumeMatchScore || 0}%</span>
             </div>
             <span className="text-[7px] font-bold text-emerald-700/60 uppercase tracking-tighter">ATS Score</span>
          </div>
        </section>

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
    </>)
}