export const InputCard = ({ label, icon: Icon, children, className = "" }) => (
  <div className={`p-2 rounded-xl border border-slate-100 bg-slate-50 transition-all ${className}`}>
    <label className="text-[8px] font-black text-slate-400 flex items-center gap-1 uppercase">
      {Icon && <Icon size={8}/>} {label}
    </label>
    {children}
  </div>
);

export const Select = ({ value, options, onChange, className = "" }) => (
  <select className={`text-[10px] font-bold outline-none w-full bg-transparent text-slate-700 cursor-pointer ${className}`} value={value} onChange={onChange}>
    {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.id} value={o.id}>{o.label}</option>)}
  </select>
);

export const INITIAL_JOB_STATE = {
    resumeId: "", 
    coverLetterId: "", 

    companyName: "", 
    position: "", 
    seniorityLevel: "", 
    jobType: "Not Mentioned", 
    
    rawDescription: "", 
    aiDescription: "", 

    requirements: [], perks: [], businessModel: "Not Mentioned", companyInsights: "",
    stage: "saved", 
    state: "pending",

    
    postedDate: new Date().toISOString().split('T')[0],
    jobLocation: "", 
    jobUrl: "", 
    minSalary: "", maxSalary: "", currency: "USD", period: "yearly",
    resumeMatchScore: 82 
  }
