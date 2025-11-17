import React from 'react';
import ReactDOM from 'react-dom/client';
// المسار الصحيح: بدون لاحقة
import App from './App';
// المسار الصحيح: مع لاحقة
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);