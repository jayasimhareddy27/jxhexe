// Prompt templates for Cover Letter extraction and generation
const clFormatPrompts = {
  personalInformation: {
    id: 1,
    key: 'personalInformation',
    title: 'Your Contact Info', // UPDATED
    arrayFieldKey: false,
    fields: ['name', 'email', 'phone', 'address', ],
    initial: { 
      name: 'Jonathan Doe', 
      email: 'j.doe@example.com', 
      phone: '+1 (555) 000-0000', 
      address: '123 Business Way, New York, NY 10001'
    },
    prompt: `Act as an expert document parser. Extract the sender's contact details.
Return ONLY a valid JSON object. No prose, no markdown code blocks, no explanation.
{
  "name": "Full Name",
  "email": "Email Address",
  "phone": "Phone Number",
  "address": "Full physical address"
}
Use null for any field not explicitly found.

Source Text:`
  },

  recipientInformation: {
    id: 2,
    key: 'recipientInformation',
    title: 'Employer Information', // UPDATED
    arrayFieldKey: false,
    fields: ['managerName', 'companyName', 'companyAddress', 'positionTitle'],
    initial: { 
      managerName: 'Hiring Manager', 
      companyName: 'Target Company Name', 
      companyAddress: '123 Enterprise Way, City, State', 
      positionTitle: 'Target Position Title'
    },
    prompt: `Identify the hiring manager and company details from the text.
Return ONLY a valid JSON object. 
{
  "managerName": "Name of manager or 'Hiring Manager'",
  "companyName": "Name of the target company",
  "companyAddress": "Full company address if available",
  "positionTitle": "The job title being applied for"
}
Use null for missing fields.

Source Text:`
  },

  letterMeta: {
    id: 3,
    key: 'letterMeta',
    title: 'Date & Subject Line', // UPDATED
    arrayFieldKey: false,
    fields: ['date', 'subjectLine', 'referenceNumber'],
    initial: { 
      date: `${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getDate().toString().padStart(2, '0')}/${new Date().getFullYear()}`, 
      subjectLine: 'Application for [Position Title]', 
      referenceNumber: '' 
    },
    prompt: `Extract the formal elements of the letter.
Return ONLY a valid JSON object.
{
  "date": "MM-DD-YYYY",
  "subjectLine": "The RE: or Subject line of the letter",
  "referenceNumber": "Job ID or Ref Number"
}
If no date is found, use the current date. 

Source Text:`
  },

  letterContent: {
    id: 4,
    key: 'letterContent',
    title: 'Greeting & Opening', // UPDATED
    arrayFieldKey: false,
    fields: ['salutation', 'intro', 'conclusion'],
    initial: { 
      salutation: 'Dear First Name Last Name or Hiring Manager: ,', 
      intro: 'I am writing to express my enthusiastic interest in the [Position Name] role at [Company Name]. With my background in [Your Field], I am confident that I can contribute significantly to your team.', 
      conclusion: 'Thank you for your time and consideration. I am eager to discuss how my experience can support your goals and look forward to the possibility of an interview.'
    },
    prompt: `Extract the opening and closing remarks. Do not extract the main body paragraphs here.
Return ONLY a valid JSON object.
{
  "salutation": "The formal greeting",
  "intro": "The opening paragraph stating intent",
  "conclusion": "The final call to action or closing paragraph"
}

Source Text:`
  },

  Letterbody: {
    id: 5,
    key: 'letterBodyParagraphs',
    title: 'Letter Content', // UPDATED
    arrayFieldKey: true,
    fields: ['bodyParagraph'],
    initial: [
      { bodyParagraph: "With a strong background in [Your Field/Skill], I have developed a deep understanding of [Specific Industry Problem]. In my previous role at [Previous Company], I successfully [Achievement], which resulted in [Quantifiable Result]. I am confident that my technical expertise and problem-solving abilities make me an ideal candidate for this position." }
    ],
    prompt: `Extract the core experience paragraphs. Break the main text into a logical sequence of paragraphs.
Return ONLY a JSON array of objects.
[
  { "bodyParagraph": "" },
] 
Do not include the salutation or the sign-off.

Source Text:`
  },  
  onlineProfiles: {
    id: 6,
    key: 'onlineProfiles',
    title: 'Social & Portfolio Links', // UPDATED
    arrayFieldKey: false,
    fields: ['linkedin', 'github', 'portfolio', 'other'],
    initial: {
      linkedin: 'linkedin.com/in/username', 
      github: 'github.com/username', 
      portfolio: 'portfolio-link.com', 
      other: ''
    },
    prompt: `Extract the core experience paragraphs. Break the main text into a logical sequence of paragraphs.
Return ONLY a JSON array of objects.
{
  "linkedin": "LinkedIn URL",
  "github": "GitHub URL",
  "portfolio": "Portfolio URL",
  "other": "Other relevant profile URL"
}
Do not include the salutation or the sign-off.

Source Text:`
  },  

  signOff: {
    id: 7,
    key: 'signOff',
    title: 'Closing & Signature', // UPDATED
    arrayFieldKey: false,
    fields: ['complimentaryClose', 'signatureName'],
    initial: { 
      complimentaryClose: 'Sincerely,', 
      signatureName: 'John Doe' 
    },
    prompt: `Extract the formal sign-off.
Return ONLY a valid JSON object.
{
  "complimentaryClose": "e.g., Sincerely, or Best Regards,",
  "signatureName": "The sender's full name as written at the bottom"
}

Source Text:`
  }
};

// Exports remains the same
export const clExtractionPhases = Object.values(clFormatPrompts);
export const clPromptMap = Object.fromEntries(
  Object.values(clFormatPrompts).map((p) => [p.id, p.prompt])
);
export { clFormatPrompts };