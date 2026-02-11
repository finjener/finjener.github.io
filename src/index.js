import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Note: Theme-specific CSS is imported by the theme modules themselves
// No need for index.css or themeInit anymore

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);