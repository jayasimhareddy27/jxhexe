import React from 'react';

export default function ScrapeTab({ job, onScrape }) {
  return (
    <div className="space-y-4">
      <button 
        onClick={onScrape}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
      >
        Scrape Current Page
      </button>

      {job && (
        <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
          <div className="text-sm">
            <b className="text-gray-700">Title:</b> {job.title}
          </div>
          <div className="text-sm truncate">
            <b className="text-gray-700">URL:</b> {job.url}
          </div>
        </div>
      )}
    </div>
  );
}