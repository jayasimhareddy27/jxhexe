import { runScraperPipeline } from "./scraper";

/**
 * executeJobDiscovery
 * Orchestrates the full scraping process from the browser tab.
 */
export const executeJobDiscovery = async (tab) => {
  // 1. Get raw HTML from the tab
  const [{result:jobdatadocument}] = await chrome.scripting.executeScript({target: { tabId: tab.id },func: () => document.documentElement.innerHTML})
  // 2. Run the strategy-based scraper
  const scrapedData = await runScraperPipeline(jobdatadocument, tab.url);
  return {
    ...scrapedData,
    jobUrl: tab.url,
    aiDescription: "Direct Site-Specific Extraction complete.",
    tags: []
  };
};

