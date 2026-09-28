import React from 'react';
import { createRoot } from 'react-dom/client';
import PyFarm from './PyFarm';
import './index.css';
import './pyfarm.css';

// Standalone entry point. PyFarm is a self-contained module: to mount it inside
// another PyBe client instead, render <PyFarm /> there and import pyfarm.css.
// `onExit` is optional — pass it when there is a host app to return to.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PyFarm />
  </React.StrictMode>
);
