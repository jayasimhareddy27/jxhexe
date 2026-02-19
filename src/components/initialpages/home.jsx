import React, { useState } from 'react';
import ScrapeTab from '../tabs/scrapetab';
import QATab from '../tabs/QAtab';
import ProfileTab from '../tabs/profiletab';

export default function Homepage() {
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { id: 1, label: 'Scrape', component: <ScrapeTab /> },
    { id: 2, label: 'Q&A', component: <QATab /> },
    { id: 3, label: 'Profile', component: <ProfileTab /> }
  ];

  return (
    <div className="flex flex-col h-screen p-1 w-full bg-[var(--color-background-primary)] font-sans overflow-hidden">
      <nav className="flex w-full bg-[var(--color-background-secondary)] shrink-0 shadow-sm border-b border-[var(--color-border-primary)]">
        <ul className="flex w-full list-none p-0 m-0">
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-1">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`nav-link w-full justify-center py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--color-background-primary)]">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </main>
    </div>
  );
}