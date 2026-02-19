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
    initial: [ {companyName:'', jobTitle:'', responsibilities:'', location:'', startDate:'', endDate:''}],

    prompt: `Extract work experience.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
[ 
  {
    "companyName": "",
    "jobTitle": "",
    "responsibilities": "",
    "location": "",
    "startDate": "MM-DD-YYYY",
    "endDate": "MM-DD-YYYY"
  }
]
Use MM-DD-YYYY. Set null if missing.

Resume text:`
  },
  projects: {
    id: 5,
    key: 'projects',
    title: 'Projects',
    arrayFieldKey: true,
    fields: ['projectName', 'projectDescription', 'technologiesUsed', 'startDate', 'endDate', 'projectLink'],
    initial: [ {projectName:'', projectDescription:'', technologiesUsed:'', startDate:'', endDate:'', projectLink:''}],

    prompt: `Extract projects.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
[ 
  
  {
    "projectName": "",
    "projectDescription": "",
    "technologiesUsed": "",
    "startDate": "MM-DD-YYYY",
    "endDate": "MM-DD-YYYY",
    "projectLink": ""
  }
]
Make sure you can give as much as projectDescription as possible using the information and "technologiesUsed" is comma-separated. Set null if missing.

Resume text:`
  },

//Not array
  skillsSummary: {
    id: 6,
    key: 'skillsSummary',
    title: 'Skills Summary',
    fields: ['technicalSkills', 'tools', 'softSkills', 'languagesSpoken', 'certificationsSkills' ],
    initial: { technicalSkills: '', tools: '', softSkills: '', languagesSpoken: '', certificationsSkills: '' },
    prompt: `Extract skills.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{ 
  "technicalSkills": "",
  "tools": "",
  "softSkills": "",
  "languagesSpoken": "",
  "certificationsSkills": ""
}
Use comma-separated strings. Set null if missing.

Resume text:`
  },

//array
  certifications: {
    id: 7,
    key: 'certifications',
    title: 'Certifications',
    arrayFieldKey: true,
    fields: ['certificationName', 'issuer', 'credentialURL'],
    initial: [ {certificationName:'', issuer:'', credentialURL: ''}],
    prompt: `Extract certifications.
Return as JSON array, donot wrap the content in ''' or any other characters or donot add comments or explanation or donot skip a field every field is important:
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

//Not array
  careerSummary: {
    id: 8,
    key: 'careerSummary',
    title: 'Career Summary',
    arrayFieldKey: false,
    fields: ['summary', 'summaryGenerated', ],
    initial: { summary: '', summaryGenerated: '', },
    prompt: `Extract career summary.
Return as JSON, donot wrap the content in ''' or any other characters or donot add comments or explanation:
{
  "summary": "",
  "summaryGenerated": ""
}
If Summary already exists then always make sure to set summary to existing summary and donot miss any information. Set summaryGenerated to null if unavailable.

Resume text:`
  },

};

// Exports
export const resumeextractionPhases = Object.values(resumeformatPrompts);
export const resumepromptMap = Object.fromEntries(
  Object.values(resumeformatPrompts).map((p) => [p.id, p.prompt])
);
export {resumeformatPrompts}