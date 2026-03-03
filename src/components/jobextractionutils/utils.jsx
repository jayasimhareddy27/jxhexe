import { fetchJobPhaseData } from "../../../lib/redux/features/job";


export const SITE_CONFIGS = {
  LINKEDIN: { domain: "linkedin.com/jobs" },
  INDEED: { domain: "indeed.com" },
  WORKDAY: { domain: "myworkdayjobs.com" },
  GREENHOUSE: { domain: "boards.greenhouse.io" },
  HANDSHAKE: { domain: "joinhandshake.com" },
  ZIPRECRUITER: { domain: "ziprecruiter.com" }   // ← added
};

/**
 * SALARY PARSER: Normalizes strings like "$100–120K/yr"
 */
/**
 * SALARY PARSER: Normalizes strings like "$100 - 120k/yr" or "$25 - 28/hr"
 */
export const parseSalaryString = (rawSalary) => {
  const result = { min: "", max: "", currency: "USD", period: "yearly" };
  if (!rawSalary || !rawSalary.includes('$')) return result;

  // 1. Basic cleaning
  const cleanStr = rawSalary.replace(/,/g, '').toLowerCase();
  
  // 2. Extract numbers and 'k' suffixes
  const matches = cleanStr.match(/(\d+(?:\.\d+)?k?)/g);

  if (matches) {
    const hasK = (val) => val.includes('k');
    const getNum = (val) => parseFloat(val);

    let minRaw = matches[0];
    let maxRaw = matches.length > 1 ? matches[1] : null;

    // Apply "k" to both if only max has it (e.g., "100 - 120k")
    const maxIsK = maxRaw && hasK(maxRaw);
    const minIsK = hasK(minRaw);

    let minVal = getNum(minRaw);
    let maxVal = maxRaw ? getNum(maxRaw) : null;

    // Smart Multiplier: If max is 'k' and min is small (e.g. < 1000), treat min as 'k' too
    if (minIsK || (maxIsK && minVal < 1000)) {
      minVal = minVal * 1000;
    }
    if (maxIsK) {
      maxVal = maxVal * 1000;
    }

    result.min = minVal.toString();
    result.max = maxVal ? maxVal.toString() : "";
  }

  // 3. Detect Period
  if (cleanStr.includes('/hr') || cleanStr.includes('hour')) result.period = "hourly";
  else if (cleanStr.includes('/mo') || cleanStr.includes('month')) result.period = "monthly";
  else result.period = "yearly";

  // 4. Detect Currency (Fallback to USD)
  if (cleanStr.includes('₹') || cleanStr.includes('inr')) result.currency = "INR";
  else if (cleanStr.includes('€') || cleanStr.includes('eur')) result.currency = "EUR";
  else if (cleanStr.includes('£') || cleanStr.includes('gbp')) result.currency = "GBP";

  return result;
};
/**
 * DOMAIN-SPECIFIC EXTRACTORS
 */

const linkedinExtractor = (doc) => (
  {
  companyName: doc.querySelector(".job-details-jobs-unified-top-card__company-name a")?.innerText?.trim() || "",
  position: doc.querySelector(".job-details-jobs-unified-top-card__job-title h1")?.innerText?.trim() || "",
  jobLocation: doc.querySelector(".job-details-jobs-unified-top-card__primary-description-container .tvm__text--low-emphasis")?.innerText?.trim() || "",
  rawSalary: doc.querySelector(".job-details-fit-level-preferences .tvm__text--low-emphasis strong")?.innerText || "",
  descriptionSelector: doc.querySelector('.jobs-description__content')?.innerText.trim() || doc.querySelector("main")?.innerText.trim() || doc.body.innerText.substring(0, 5000)
});

const indeedExtractor = (doc) => ({
  companyName: doc.querySelector("[data-company-name='true']")?.innerText?.trim() || "",
  position: doc.querySelector(".jobsearch-JobInfoHeader-title")?.innerText?.trim() || "",
  jobLocation: doc.querySelector("#jobLocationSection")?.innerText?.trim() || "",
  rawSalary: doc.querySelector(".js-expectation-salary-text, .salary-snippet-container")?.innerText || "",
  descriptionSelector: doc.querySelector('#jobDescriptionText')?.innerText.trim() || doc.querySelector("main")?.innerText.trim() || doc.body.innerText.substring(0, 5000)
});

const workdayExtractor = (doc) => ({
  companyName: doc.querySelector('[data-automation-id="workdayLogo"]')?.getAttribute('alt') || "",
  position: doc.querySelector('[data-automation-id="jobPostingHeader"]')?.innerText?.trim() || "",
  jobLocation: doc.querySelector('[data-automation-id="location"]')?.innerText?.trim() || "",
  rawSalary: doc.querySelector('[data-automation-id="salaryInfo"]')?.innerText || "",
  descriptionSelector: doc.querySelector('[data-automation-id="jobPostingDescription"]')?.innerText.trim() || doc.querySelector("main")?.innerText.trim() || doc.body.innerText.substring(0, 5000)
});

const greenhouseExtractor = (doc) => ({
  companyName: doc.querySelector(".company-name")?.innerText?.trim() || "",
  position: doc.querySelector(".app-title")?.innerText?.trim() || "",
  jobLocation: doc.querySelector(".location")?.innerText?.trim() || "",
  rawSalary: "", 
  descriptionSelector: doc.querySelector("#content")?.innerText.trim() || doc.querySelector("main")?.innerText.trim() || doc.body.innerText.substring(0, 5000)
});

const handshakeExtractor = (doc) => {
  const metadataItems = Array.from(doc.querySelectorAll(".fRPWwm"));
  
  return {
    companyName: doc.querySelector(".bzLWhG")?.innerText?.trim() || "",
    position: doc.querySelector("h1")?.innerText?.trim() || "",
    jobLocation: metadataItems.find(el => {
      const text = el.innerText.toLowerCase();
      return text.includes('based in') || text.includes('remote') || text.includes('onsite');
    })?.innerText?.trim() || "",
    rawSalary: metadataItems.find(el => el.innerText.includes('$'))?.innerText?.trim() || "",
    descriptionSelector: Array.from(doc.querySelectorAll(".imhYWe")).slice(0, 2).map(el => el.innerText.trim()).join("\n\n") 
  };
};

const ziprecruiterExtractor = (doc) => {
  // SCOPED SEARCH: Find the main container first
  const container = doc.querySelector('[data-testid="job-details-scroll-container"]') || doc;
  
  // Search only inside the container
  const infoItems = Array.from(container.querySelectorAll("p.text-primary.text-body-md"));
  
  return {
    companyName: container.querySelector('a[aria-label]')?.innerText?.trim() || "",
    position: container.querySelector("h2")?.innerText?.trim() || "",
    jobLocation: infoItems.find(el => el.innerText.includes(','))?.innerText?.split('•')[0]?.trim() || "",
    rawSalary: infoItems.find(el => el.innerText.includes('$'))?.innerText || "",
    descriptionSelector: doc.querySelector("[data-testid='job-details-scroll-container']")?.innerText.trim() || doc.querySelector("main")?.innerText.trim() || doc.body.innerText.substring(0, 5000)
  };
};

const aiFallbackExtractor = async (doc) => {
  const rawTextjobDescriptionxt = doc.body.innerText.substring(0, 5000);
  const jobCoreData = await fetchJobPhaseData(1, "jobCore", rawTextjobDescriptionxt);
  
  return {
    companyName: jobCoreData?.companyName || "", 
    position: jobCoreData?.position || "", 
    jobLocation: jobCoreData?.jobLocation || "", 
    rawSalary: jobCoreData?.salary || "", // Maps to 'salary' key in prompt
    descriptionSelector: "", // Maps to 'aiDescription' key
  };
};

export const lazyDescriptionExtractor = async (tab) => {
  const [{ result: html }] = await chrome.scripting.executeScript({target: { tabId: tab.id },func: () => document.body.innerText });
  const textContext = html.substring(0, 6000); 
  const rewriteResult = await fetchJobPhaseData(2, "jobDuties", textContext);
  return rewriteResult?.aiDescription || textContext.substring(0, 2000);
};

export const analyzeJobInsights = async (tab) => {
  const [{ result: html }] = await chrome.scripting.executeScript({target: { tabId: tab.id },func: () => document.body.innerText });
  const textContext = html.substring(0, 6000); 
  return await fetchJobPhaseData(3, "deepInsights", textContext, 300); 
};

export const extractByUrl = (doc, url) => {
  if (url.includes(SITE_CONFIGS.LINKEDIN.domain)) return linkedinExtractor(doc);
  if (url.includes(SITE_CONFIGS.INDEED.domain)) return indeedExtractor(doc);
  if (url.includes(SITE_CONFIGS.WORKDAY.domain)) return workdayExtractor(doc);
  if (url.includes(SITE_CONFIGS.GREENHOUSE.domain)) return greenhouseExtractor(doc);
  if (url.includes(SITE_CONFIGS.HANDSHAKE.domain)) return handshakeExtractor(doc);
  if (url.includes(SITE_CONFIGS.ZIPRECRUITER.domain)) return ziprecruiterExtractor(doc);  // ← added
  return aiFallbackExtractor(doc);
};