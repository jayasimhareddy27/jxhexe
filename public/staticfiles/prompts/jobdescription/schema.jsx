export const jobExtractionPrompts = [
  {
    id: 1,
    key: 'jobCore',
    title: 'Core Info & Seniority',
    prompt: `You are a strict JSON extractor. Extract job details from the text below. 
Return ONLY a valid JSON object. NO explanations, NO comments, NO extra text. 

**RULES:**
- If a field is missing, use empty string "" (never null).

**SCHEMA:**
{
  "companyName": "",
  "position": "",
  "jobLocation": "",
  "salary": "",
}

**EXAMPLES:**
Output: {"companyName":"Google","position":"Software Engineer","jobLocation":"","salary":""}

**Job text:**`
  },
{
  id: 2,
  key: 'jobDuties',
  title: 'Responsibilities',
  prompt: `You are a professional technical recruiter. Analyze the job text and rewrite it into a clear, concise summary.

STRICT RULES:
- Return ONLY valid JSON.
- Format the "aiDescription" as a clean summary with bullet points using \\n for new lines.
- Remove all "junk" (e.g., "Welcome", "Sign in", "Equal Opportunity Statement", "Apply Now" buttons).
- Focus strictly on: Core Responsibilities, Required Skills, and Benefits.

SCHEMA:
{
  "aiDescription": "Summarized job duties and requirements..."
}

Job Text:`
},
{
  id: 3,
  key: 'deepInsights',
  title: 'Deep Insights',
  prompt: `STRICT ANALYST MODE Analyze the job text and return ONLY a JSON object.

SCHEMA:
{
  "seniorityLevel": "Intern|Entry Level|Junior|Mid-Level|Senior|Staff|Lead",
  "jobType": "Full-time|Part-time|Contract|Internship",
  "businessModel": "Briefly describe how they make money (e.g. B2B SaaS, E-commerce)",
  "companyInsights": "1 sentence about company culture or recent news",
  "postedDate": "YYYY-MM-DD (Extract from text or use today's date)",
  "perks": "Bulleted list of perks/benefits",
  "requirements": "Bulleted list of requirements"
}

JOB TEXT:
`
}
];

export const jobPromptMap = Object.fromEntries(
  jobExtractionPrompts.map((p) => [p.id, p.prompt])
);

