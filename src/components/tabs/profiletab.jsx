import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { returnuseReference } from '../../../lib/redux/features/resumes/resumecrud/thunks';
import { fetchDocumentById } from '../../../lib/redux/features/editor/thunks';
import { Companynameletters } from '../../../src/globalvar/companydetails';

export default function ProfileTab() {

  const dispatch = useDispatch();
  const resumeDataMap = useSelector((state) => state.editor.formDataMap);

  const [copiedField, setCopiedField] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [openSections, setOpenSections] = useState({
    contact: true,
    summary: false,
    experience: false,
    projects: false,
    education: false,
    certifications: false,
    profiles: false,
    skills: false
  });

  const [expandedItem, setExpandedItem] = useState({
    experience: 0,
    projects: 0,
    education: 0,
    certifications: 0
  });

  /* ---------------- HELPERS ---------------- */

  const safeArray = (val) => Array.isArray(val) ? val : val ? [val] : [];
  const cleanValue = (val) => val ? String(val).trim() : "";

  const normalizeSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(',').map(s => s.trim()).filter(Boolean);
  };

  /* -------- NORMALIZED PROFILE DATA -------- */

  const profileData = useMemo(() => ({
    personal: resumeDataMap?.personalInformation || {},
    address: resumeDataMap?.addressDetails || {},
    summary: resumeDataMap?.careerSummary?.summary || "",
    experience: safeArray(resumeDataMap?.workExperience),
    projects: safeArray(resumeDataMap?.projects),
    education: safeArray(resumeDataMap?.educationHistory),
    certifications: safeArray(resumeDataMap?.certifications),
    profiles: resumeDataMap?.onlineProfiles || {},
    skills: normalizeSkills(resumeDataMap?.skillsSummary?.technicalSkills),
  }), [resumeDataMap]);

  /* ---------------- ACTIONS ---------------- */

  const toggleSection = (section) => {
    setOpenSections(prev => {
      const newState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = key === section;
      });
      return newState;
    });
  };

  const toggleItem = (section, index) =>
    setExpandedItem(prev => ({
      ...prev,
      [section]: prev[section] === index ? -1 : index
    }));

  const copyToClipboard = (text, label) => {
    const value = cleanValue(text);
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const copyAllSkills = () => {
    if (!profileData.skills.length) return;
    const combined = profileData.skills.join(', ');
    copyToClipboard(combined, "All Skills");
  };

  /* ------------ LOAD PROFILE DATA ------------ */

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setIsLoading(false);

      try {
        const res = await dispatch(returnuseReference(token)).unwrap();
        const ref = res?.references?.myProfileRef;
        if (ref) {
          await dispatch(fetchDocumentById({ id: ref, type: "resume" }));
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [dispatch]);

  /* ---------------- LOADER ---------------- */

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--color-background-primary)]">
        <div className="loader shadow-modal">
          {Companynameletters.slice(0, 3).map((l, i) => (
            <span key={i} className="letter" style={{ animationDelay: `${i * 0.2}s` }}>
              {l}
            </span>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- REUSABLE ROW ---------------- */

  const CopyRow = ({ label, value, isLong }) => {
    const clean = cleanValue(value);
    if (!clean) return null;

    return (
      <div
        onClick={(e) => { e.stopPropagation(); copyToClipboard(clean, label); }}
        className="group flex flex-col px-3 py-2.5 border-b last:border-0 cursor-pointer hover:bg-[var(--color-background-secondary)]"
      >
        <div className="flex justify-between">
          <span className="text-[7px] font-black uppercase tracking-widest text-[var(--color-text-placeholder)]">
            {label}
          </span>
          <span className="text-[7px] opacity-0 group-hover:opacity-100 italic text-[var(--color-button-primary-bg)]">
            Copy
          </span>
        </div>

        <div className={`text-[10px] font-medium leading-relaxed ${isLong ? 'italic line-clamp-3' : 'truncate'}`}>
          {clean}
        </div>
      </div>
    );
  };

  const Section = ({ title, keyName, children }) => (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <button
        onClick={() => toggleSection(keyName)}
        className="w-full flex justify-between items-center px-3 py-3 bg-[var(--color-background-secondary)] border-b"
      >
        <h3 className="text-[14px] font-extrabold uppercase tracking-wide text-[var(--color-text-primary)]">
          {title}
        </h3>
        <span className={`text-[8px] ${openSections[keyName] ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {openSections[keyName] && children}
    </div>
  );

  return (
    <div className="p-3 pb-20 overflow-y-auto space-y-4">

      {copiedField && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-[9px] px-4 py-2 rounded-full shadow-2xl bg-[var(--color-button-primary-bg)] text-white">
          COPIED: {copiedField}
        </div>
      )}

      {/* CONTACT */}
      <Section title="Contact Info" keyName="contact">
        <div className="bg-[var(--color-card-bg)]">
          <CopyRow label="Full Name" value={profileData.personal.fullName} />
          <CopyRow label="firstName" value={profileData.personal.firstName} />
          <CopyRow label="lastName" value={profileData.personal.lastName} />
          <CopyRow label="Email" value={profileData.personal.email} />
          <CopyRow label="Phone" value={profileData.personal.phoneNumber} />
          <CopyRow label="City" value={profileData.address.city} />
          <CopyRow label="State" value={profileData.address.state} />
          <CopyRow label="Country" value={profileData.address.country} />
        </div>
      </Section>

      {/* SUMMARY */}
      <Section title="Career Summary" keyName="summary">
        <CopyRow label="Summary" value={profileData.summary} isLong />
      </Section>

      {/* PROFILES */}
      <Section title="Online Profiles" keyName="profiles">
        <div className="bg-[var(--color-card-bg)]">
          <CopyRow label="LinkedIn" value={profileData.profiles.linkedin} />
          <CopyRow label="GitHub" value={profileData.profiles.github} />
          <CopyRow label="Portfolio" value={profileData.profiles.portfolio} />
          <CopyRow label="LeetCode" value={profileData.profiles.leetcode} />
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section title="Experience" keyName="experience">
        {profileData.experience.map((exp, i) => (
          <div key={i} className="border-t">
            <button
              onClick={() => toggleItem('experience', i)}
              className="w-full px-3 py-2 flex justify-between items-center hover:bg-[var(--color-background-secondary)]"
            >
              <span className="text-[12px] font-bold text-[var(--color-text-primary)]">
                {exp.jobTitle || "Work Entry"}
              </span>
              <span>{expandedItem.experience === i ? '−' : '+'}</span>
            </button>

            {expandedItem.experience === i && (
              <div className="bg-[var(--color-card-bg)] ml-2 border-l pl-2">
                <CopyRow label="Company" value={exp.companyName} />
                <CopyRow label="Title" value={exp.jobTitle} />
                <CopyRow label="Start Date" value={exp.startDate} />
                <CopyRow label="End Date" value={exp.endDate || "Present"} />
                <CopyRow label="Description" value={exp.responsibilities} isLong />
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* PROJECTS */}
      <Section title="Projects" keyName="projects">
        {profileData.projects.map((proj, i) => (
          <div key={i} className="border-t">
            <button
              onClick={() => toggleItem('projects', i)}
              className="w-full px-3 py-2 flex justify-between items-center hover:bg-[var(--color-background-secondary)]"
            >
              <span className="text-[12px] font-bold text-[var(--color-text-primary)]">
                {proj.projectName || "Project Entry"}
              </span>
              <span>{expandedItem.projects === i ? '−' : '+'}</span>
            </button>

            {expandedItem.projects === i && (
              <div className="bg-[var(--color-card-bg)] ml-2 border-l pl-2">
                <CopyRow label="Project" value={proj.projectName} />
                <CopyRow label="Tech Stack" value={proj.technologiesUsed} />
                <CopyRow label="Description" value={proj.projectDescription} isLong />
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* EDUCATION */}
      <Section title="Education" keyName="education">
        {profileData.education.map((edu, i) => (
          <div key={i} className="border-t">
            <button
              onClick={() => toggleItem('education', i)}
              className="w-full px-3 py-2 flex justify-between items-center hover:bg-[var(--color-background-secondary)]"
            >
              <span className="text-[12px] font-bold text-[var(--color-text-primary)]">
                {edu.university || "University"}
              </span>
              <span>{expandedItem.education === i ? '−' : '+'}</span>
            </button>

            {expandedItem.education === i && (
              <div className="bg-[var(--color-card-bg)] ml-2 border-l pl-2">
                <CopyRow label="Institute" value={edu.university} />
                <CopyRow label="Degree" value={edu.degree} />
                <CopyRow label="Major" value={edu.major} />
                <CopyRow label="GPA" value={edu.gpa} />
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* CERTIFICATIONS */}
      <Section title="Certifications" keyName="certifications">
        {profileData.certifications.map((cert, i) => (
          <div key={i} className="bg-[var(--color-card-bg)] border-t ml-2 border-l pl-2">
            <CopyRow label="Certification" value={cert.name} />
            <CopyRow label="Issuer" value={cert.issuer} />
            <CopyRow label="Issued" value={cert.issueDate} />
          </div>
        ))}
      </Section>

      {/* SKILLS */}
      <Section title="Skills" keyName="skills">
        <div className="p-3 space-y-2 bg-[var(--color-card-bg)]">
          <button
            onClick={copyAllSkills}
            className="text-[9px] px-3 py-1 rounded bg-[var(--color-button-primary-bg)] text-white"
          >
            Copy All Skills
          </button>

          <div className="flex flex-wrap gap-1">
            {profileData.skills.length === 0
              ? <span className="text-[9px] text-gray-400">No skills found</span>
              : profileData.skills.map((skill, i) => (
                  <span
                    key={i}
                    onClick={() => copyToClipboard(skill, skill)}
                    className="card-tag cursor-pointer hover:bg-[var(--color-button-primary-bg)] hover:text-white text-[9px] px-2 py-1 rounded-md"
                  >
                    {skill}
                  </span>
                ))
            }
          </div>
        </div>
      </Section>

    </div>
  );
}
