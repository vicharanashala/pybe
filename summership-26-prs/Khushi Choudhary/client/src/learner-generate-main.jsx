import React from 'react';
import { createRoot } from 'react-dom/client';
import LearnerGenerateApp from './learner/LearnerGenerateApp.jsx';
import './styles.css';
// LearnerGenerateApp reuses the .tool-topbar chrome defined in mentor.css
// (same shell as the mentor tool pages), so that stylesheet comes along too.
import './mentor/mentor.css';
import './learner/learner.css';

createRoot(document.getElementById('root')).render(<LearnerGenerateApp />);
