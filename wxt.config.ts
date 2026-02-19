import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
    manifest: {
    name: 'JXH AI Job Assistant',
    description: 'Scrape jobs, tailor resume, auto-fill applications',
    version: '1.0.0',
    permissions: ['storage', 'activeTab', 'scripting',],
    action: {}, // This allows the icon to be clicked
    host_permissions: ['<all_urls>'],
  },
});
