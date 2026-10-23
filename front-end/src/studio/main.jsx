import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/stylesheets/studio/studio.css';
import Studio from './Studio';

createRoot(document.getElementById('studio')).render(
  <StrictMode>
    <Studio />
  </StrictMode>,
);
