import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/meeting.css';
import './styles/plots.css';
import './styles/quiz.css';
import './styles/outcome.css';
import './styles/responsive.css';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
