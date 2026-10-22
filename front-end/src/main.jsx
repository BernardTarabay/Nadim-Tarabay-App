import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/stylesheets/base.css';
import App from './App';

document.head.querySelectorAll('[data-prerender]').forEach((tag) => tag.remove());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
