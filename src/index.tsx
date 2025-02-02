import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import { pullData } from './data';

const loadData = async () => {
  await pullData();
};

const root = ReactDOM.createRoot(document.getElementById('root'));
// データを読み込んでから描画
loadData().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})

serviceWorkerRegistration.register();
reportWebVitals();
