import { extractByUrl, parseSalaryString } from "./utils";

export const runScraperPipeline = async (JobDataDocument, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(JobDataDocument, "text/html");
  
  // 1. Get Domain Specific Data using the imported router
  const urlData = await extractByUrl(doc, url) || {};
  // 2. Parse the salary
  const structuredSalary = parseSalaryString(urlData.rawSalary);
  return {
    companyName: urlData.companyName || "",
    position: urlData.position || "",
    jobLocation: urlData.jobLocation || "",
    minSalary: structuredSalary.min,
    maxSalary: structuredSalary.max,
    currency: structuredSalary.currency,
    period: structuredSalary.period,
    rawDescription: urlData.descriptionSelector || ""
  };
};