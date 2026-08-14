import React from 'react';
import { createRoot } from 'react-dom/client';
import MentorApp from './mentor/MentorApp.jsx';
import './styles.css';
import './mentor/mentor.css';
// The "Published" tab reuses PlaytestEngine.jsx (built for the learner BYOK
// flow) to actually play a published case study, so its styling comes along
// too — additive, doesn't conflict with mentor.css's own class names.
import './learner/learner.css';

createRoot(document.getElementById('root')).render(<MentorApp />);
