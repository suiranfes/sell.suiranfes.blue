import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from "virtual:pwa-register";
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import reportWebVitals from './reportWebVitals';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// serviceWorkerRegistration.register();
// reportWebVitals();
