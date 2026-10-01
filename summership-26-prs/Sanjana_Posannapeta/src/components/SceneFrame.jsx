import React from 'react';
import audiImg from '../../assets/audi.png';
import labImg from '../../assets/lab.png';
import viewImg from '../../assets/view.png';
import kabirImg from '../../assets/kabir1.png';
import priyaImg from '../../assets/priya1.png';

const IMAGE_MAP = {
  audi: audiImg,
  lab: labImg,
  view: viewImg,
  kabir: kabirImg,
  priya: priyaImg
};

export default function SceneFrame({ 
  background, 
  dimmed = false, 
  splitScreen = false, 
  className = '', 
  children 
}) {
  const bgStyle = {};
  if (!splitScreen && background && IMAGE_MAP[background]) {
    bgStyle.backgroundImage = `url(${IMAGE_MAP[background]})`;
  }

  return (
    <div 
      className={`storyboard-visual-panel ${dimmed ? 'dimmed' : ''} ${className}`}
      style={bgStyle}
    >
      {splitScreen ? (
        <div className="storyboard-split-container">
          <div className="storyboard-split-left" style={{ backgroundImage: `url(${kabirImg})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom center' }}>
            <div className="split-label-v3">🏛️ MAIN HALL (OUTSIDE)</div>
          </div>
          <div className="storyboard-split-right" style={{ backgroundImage: `url(${priyaImg})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom center' }}>
            <div className="split-label-v3">💻 LAB 101 (INSIDE)</div>
          </div>
        </div>
      ) : null}
      
      <div className="storyboard-lighting-overlay"></div>
      
      {/* Overlay graphic indicators */}
      {children}
    </div>
  );
}
