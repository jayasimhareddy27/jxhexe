export const convertResumeToPromptString=(resumeData) =>{
  const {   personalInformation,   careerSummary,   workExperience,   educationHistory,   skillsSummary,   projects } = resumeData;

  let promptString = `RESUME FOR ${personalInformation.fullName.toUpperCase()}\n`;
  promptString += `Email: ${personalInformation.email} | Phone: ${personalInformation.phoneNumber}\n\n`;

  // 1. Summary
  if (careerSummary?.summary) {
    promptString += `SUMMARY:\n${careerSummary.summary}\n\n`;
  }

  // 2. Skills
  if (skillsSummary) {
    promptString += `SKILLS:\n`;
    promptString += `- Technical: ${skillsSummary.technicalSkills}\n`;
    promptString += `- Tools: ${skillsSummary.tools}\n`;
    promptString += `- Soft Skills: ${skillsSummary.softSkills}\n\n`;
  }

  // 3. Experience
  if (workExperience?.length > 0) {
    promptString += `WORK EXPERIENCE:\n`;
    workExperience.forEach(job => {
      promptString += `${job.jobTitle} at ${job.companyName} (${job.startDate} to ${job.endDate})\n`;
      promptString += `${job.responsibilities}\n\n`;
    });
  }

  // 4. Projects (Optional filter if they overlap with experience)
  if (projects?.length > 0) {
    promptString += `KEY PROJECTS:\n`;
    projects.forEach(proj => {
      promptString += `${proj.projectName} (${proj.technologiesUsed})\n`;
      promptString += `${proj.projectDescription}\n\n`;
    });
  }

  // 5. Education
  if (educationHistory?.length > 0) {
    promptString += `EDUCATION:\n`;
    educationHistory.forEach(edu => {
      promptString += `${edu.degree} in ${edu.major}, ${edu.university} (Graduated: ${edu.endDate})\n`;
    });
  }

  return promptString.trim();
}

