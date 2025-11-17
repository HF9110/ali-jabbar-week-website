import React from 'react';
import ReactDOM from 'react-dom/client';
// --- (تصحيح) المسار الصحيح هو من نفس المجلد ---
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);