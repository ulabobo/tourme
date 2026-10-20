import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './app/AppRouter';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

if (
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1'
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration skipped if unsupported
    });
  });
}
