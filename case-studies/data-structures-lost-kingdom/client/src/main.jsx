import React from 'react';
import {createRoot} from 'react-dom/client';
import Story from './LostForestStory.jsx';
import './styles.css';
import '../../../../shared/story-elements.css';
createRoot(document.getElementById('root')).render(<Story/>);
