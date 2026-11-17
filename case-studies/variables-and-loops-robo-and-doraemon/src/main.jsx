import React from 'react';
import { createRoot } from 'react-dom/client';
import LearningHub from './learning/LearningHub.jsx';
import './styles.css';

// Standalone entry point for the extracted Story Learning Hub module.
// In the original PyBe app this component was mounted inside the main
// app shell and reached via the "Story Learning Hub" sidebar button.
// Here it is mounted directly so the module can run on its own.
function App() {
  return <LearningHub />;
}

createRoot(document.getElementById('root')).render(<App />);
