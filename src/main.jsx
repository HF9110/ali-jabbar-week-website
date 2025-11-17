import React from 'react';
import ReactDOM from 'react-dom/client';
// المسار الصحيح: في نفس المجلد
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);