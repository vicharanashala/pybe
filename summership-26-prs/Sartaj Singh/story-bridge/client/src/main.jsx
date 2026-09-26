import React from 'react';
import { createRoot } from 'react-dom/client';
import StoryBridge from './stories/StoryBridge';
import './app.css';

function Root() {
  return (
    <div className="app-root">
      <header className="app-bar">
        <span className="app-name">Story Bridge</span>
      </header>
      <StoryBridge />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
