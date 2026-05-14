import './index.css';
import '@config/i18n'; // WHY: initialise i18next before React renders so t() works on first paint

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/App';
import { initObservability } from './lib/observability';

// Opt-in Sentry boot — no-op when VITE_SENTRY_DSN is empty.
initObservability();

const root = document.getElementById('root');
if (!root) throw new Error('[main] #root element not found in index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
