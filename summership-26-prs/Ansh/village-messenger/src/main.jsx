import React from 'react';
import { createRoot } from 'react-dom/client';
import WorldExplorer from './WorldExplorer';

createRoot(document.getElementById('root')).render(
  <WorldExplorer onBack={() => window.history.back()} />
);
