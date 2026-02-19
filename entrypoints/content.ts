
export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
      if (msg.type === 'SCRAPE_JOB') {
        const data = {
          title: document.querySelector('h1')?.textContent || '',
          description: document.body.innerText.slice(0, 5000),
          url: window.location.href,
        };

        sendResponse(data)
      }
    })
  },
})

