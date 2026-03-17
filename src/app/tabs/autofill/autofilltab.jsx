import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { commonFieldMap } from "./fieldmapping";

export default function AutoFillPanel() {
  const resumeDataMap = useSelector((state) => state.editor.formDataMap);

  const profileData = useMemo(() => {
    const safeArray = (val) => Array.isArray(val) ? val : val ? [val] : [];
    return {
      personal: resumeDataMap?.personalInformation || {},
      address: resumeDataMap?.addressDetails || {},
      summary: resumeDataMap?.careerSummary?.summary || "",
      experience: safeArray(resumeDataMap?.workExperience),
      projects: safeArray(resumeDataMap?.projects),
      education: safeArray(resumeDataMap?.educationHistory),
      certifications: safeArray(resumeDataMap?.certifications),
      profiles: resumeDataMap?.onlineProfiles || {},
    };
  }, [resumeDataMap]);


  const handleAutoFill = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) return;

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [profileData, commonFieldMap],
        func: (data, mapping) => {
          const normalize = (str) => {
            return str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : "";
          };

          const getValue = (obj, path) => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
          };

          // Helper to find label text even if it's not explicitly linked via 'for'
          const getLabelText = (input) => {
            // 1. Try standard aria-label
            if (input.getAttribute('aria-label')) return input.getAttribute('aria-label');

            // 2. Try explicit label using 'for' attribute
            if (input.id) {
              const explicitLabel = document.querySelector(`label[for="${input.id}"]`);
              if (explicitLabel) return explicitLabel.innerText;
            }

            // 3. Try implicit label (input inside label)
            const parentLabel = input.closest('label');
            if (parentLabel) return parentLabel.innerText;

            // 4. Try browser-provided labels collection
            if (input.labels && input.labels.length > 0) {
              return Array.from(input.labels).map(l => l.innerText).join(' ');
            }

            return "";
          };

          const inputs = document.querySelectorAll("input, textarea, select");

          inputs.forEach(input => {
            // Collect all identifying strings
            const nameAttr = normalize(input.name);
            const idAttr = normalize(input.id);
            const placeholderAttr = normalize(input.placeholder);
            const labelText = normalize(getLabelText(input));
            
            // Sometimes developers put the data type in the 'type' attribute
            const typeAttr = normalize(input.getAttribute('type'));

            // Match against mapping keys
            const matchKey = Object.keys(mapping).find(key => {
              return (
                (nameAttr && nameAttr.includes(key)) ||
                (idAttr && idAttr.includes(key)) ||
                (placeholderAttr && placeholderAttr.includes(key)) ||
                (labelText && labelText.includes(key)) ||
                (typeAttr && typeAttr === key) // exact match for type like 'email'
              );
            });

            if (matchKey) {
              const path = mapping[matchKey];
              
              const value = getValue(data, path);

              if (value && typeof value === 'string') {
                input.value = value;
                
                // Trigger changes for modern frameworks
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));

                // Visual feedback
                input.style.transition = "all 0.3s ease";
                input.style.backgroundColor = "#e8f0fe";
                input.style.outline = "2px solid #2563eb";
              }
            }
          });
        },
      });
    } catch (error) {
      console.error("Autofill failed:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h2 className="text-sm font-bold mb-3 uppercase tracking-tight text-gray-700">
        Job Assistant Tools
      </h2>
      <button 
        onClick={handleAutoFill}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm transition-all active:scale-95"
      >
        ✨ Magic Auto-Fill
      </button>
      <p className="mt-2 text-[10px] text-gray-400 italic leading-tight">
        Fills forms using labels, placeholders, and IDs.
      </p>
    </div>
  );
}