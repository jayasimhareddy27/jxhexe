// Prompt templates with clear structure and format expectations
const resumeformatPrompts = {
//Not array
  personalInformation: {
    id: 1,
    key: 'personalInformation',
    title: 'Personal Information',
    arrayFieldKey: false,
    fields: ['fullName', 'firstName', 'lastName', 'email', 'phoneNumber'],
    initial: { fullName: '', firstName: '', lastName: '', email: '', phoneNumber: '' },
    prompt: `Extract the following personal information.
Return as JSON(5 mandatory fields), donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
  "fullName": "",
  "firstName": "",
  "lastName": "",
  "email": "",
  "phoneNumber": ""
}
Set null if not found.

Resume text:`
  },
  onlineProfiles: {
    id: 2,
    key: 'onlineProfiles',
    title: 'Online Profiles',
    arrayFieldKey: false,
    fields: ['linkedin', 'github', 'portfolio', 'personalWebsite', 'otherLinks', ],
    initial: { linkedin: '', github: '', portfolio: '', personalWebsite: '', otherLinks: '',  },
    prompt: `Extract links.
Return as JSON(5 mandatory fields), donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "personalWebsite": "",
  "otherLinks": ""

}
Set null if missing. "otherLinks" is comma-separated.

Resume text:`
  },

//array
  educationHistory: {
    id: 3,
    key: 'educationHistory',
    title: 'Education History',
    arrayFieldKey: true,
    fields: ['degree', 'major', 'university', 'location', 'startDate', 'endDate', 'gpa'],
    initial: [{degree:'', major:'', university:'', location:'', startDate:'', endDate:'',gpa:''}],
    prompt: `Extract education details.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
[
  {
    "degree": "",
    "major": "",
    "university": "",
    "location": "",
    "startDate": "MM-DD-YYYY",
    "endDate": "MM-DD-YYYY",
    "gpa": ""
  }
]
Use MM-DD-YYYY. Set null if missing.

Resume text:`
  },

workExperience: {
    id: 4,
    key: 'workExperience',
    title: 'Work Experience',
    arrayFieldKey: true,
    fields: ['companyName', 'jobTitle', 'responsibilities', 'location', 'startDate', 'endDate'],
    initial: [{ companyName: '', jobTitle: '', responsibilities: '', location: '', startDate: '', endDate: '' }],
    prompt: `Optimize work history for high ATS ranking. 
1. Mirror terminology: Use keywords and action verbs found in the provided Job Description.
2. Quantify: Where possible, include metrics or results from the Resume text.
3. Formatting: Rewrite 'responsibilities' as a list of 3-5 high-impact bullet points.
4. Output: Return ONLY a JSON array. 'responsibilities' MUST be a single string with "\\n" for newlines.

[ 
  {
    "companyName": "",
    "jobTitle": "",
    "responsibilities": "Bullet 1\\nBullet 2\\nBullet 3",
    "location": "",
    "startDate": "MM-DD-YYYY",
    "endDate": "MM-DD-YYYY"
  }
]

Resume text:`
  },

  projects: {
    id: 5,
    key: 'projects',
    title: 'Projects',
    arrayFieldKey: true,
    fields: ['projectName', 'projectDescription', 'technologiesUsed', 'startDate', 'endDate', 'projectLink'],
    initial: [{ projectName: '', projectDescription: '', technologiesUsed: '', startDate: '', endDate: '', projectLink: '' }],
    prompt: `Tailor project descriptions to match the Job Description requirements.
1. High-Density Keywords: Integrate technical skills mentioned in the JD into the projectDescription and technologiesUsed.
2. Description: Use bullet points (split by "\\n") highlighting specific contributions.
3. technologiesUsed: List as a comma-separated string.
4. Output: Return ONLY a JSON array.

[ 
  {
    "projectName": "",
    "projectDescription": "Achievement 1\\nAchievement 2",
    "technologiesUsed": "keyword1, keyword2",
    "startDate": "MM-DD-YYYY",
    "endDate": "MM-DD-YYYY",
    "projectLink": ""
  }
]

Resume text:`
  },

  skillsSummary: {
    id: 6,
    key: 'skillsSummary',
    title: 'Skills Summary',
    fields: ['technicalSkills', 'tools', 'softSkills', 'languagesSpoken', 'certificationsSkills'],
    initial: { technicalSkills: '', tools: '', softSkills: '', languagesSpoken: '', certificationsSkills: '' },
    prompt: `Extract and optimize skills for ATS compatibility by mirroring the Job Description.
1. Match Keywords: Scan the JD and identify required tech stack and tools. 
2. Validate: Only include skills if they are present in either the Resume or the JD (do not invent experience).
3. Formatting: Use exact phrasing from the JD (e.g., use "React.js" instead of "React" if that's what the JD uses). 
4. Output: Return ONLY valid JSON. All fields must be comma-separated strings.

{ 
  "technicalSkills": "languages, frameworks, and core technical concepts",
  "tools": "software, platforms, and methodologies",
  "softSkills": "interpersonal skills and leadership traits",
  "languagesSpoken": "",
  "certificationsSkills": ""
}

Job Description:`
  },

  certifications: {
    id: 7,
    key: 'certifications',
    title: 'Certifications',
    arrayFieldKey: true,
    fields: ['certificationName', 'issuer', 'credentialURL'],
    initial: [{ certificationName: '', issuer: '', credentialURL: '' }],
    prompt: `Extract certifications from the resume. 
Return ONLY a JSON array. 
[ 
  {
    "certificationName": "",
    "issuer": "",
    "credentialURL": ""
  }
]
Set null if missing.

Resume text:`
  },

  careerSummary: {
    id: 8,
    key: 'careerSummary',
    title: 'Career Summary',
    arrayFieldKey: false,
    fields: ['summary', 'summaryGenerated'],
    initial: { summary: '', summaryGenerated: '' },
    prompt: `Draft a professional summary (3-4 sentences) optimized for ATS.
1. Format: [Current Job Title] with [X] years of experience in [Key Industry/Domain].
2. Alignment: Explicitly bridge the user's past experience with the top 3 requirements of the Job Description.
3. Buzzwords: Use high-scoring keywords found in the JD.
4. Tone: Professional and result-oriented. Avoid generic fluff.
5. Output: Return ONLY valid JSON.

{
  "summary": "",
  "summaryGenerated": "true"
}

Resume and Job Description:`
  }
};

// Exports
export const resumeextractionPhases = Object.values(resumeformatPrompts);
export const resumepromptMap = Object.fromEntries(
  Object.values(resumeformatPrompts).map((p) => [p.id, p.prompt])
);
export {resumeformatPrompts}