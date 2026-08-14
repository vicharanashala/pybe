import React, { useState } from 'react';
import Scenario from './Scenario';
import caseStudies from './data.json';

function App() {
  const [activeCaseStudyId, setActiveCaseStudyId] = useState(null);

  const activeCaseStudy = caseStudies.find(c => c.id === activeCaseStudyId);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">PyBe</h1>
        <p className="app-subtitle">Discover programming naturally.</p>
      </header>

      {!activeCaseStudy ? (
        <div className="case-studies-grid">
          {caseStudies.map((study) => (
            <div key={study.id} className="case-card fade-in">
              <div>
                <h2 className="case-title">{study.title}</h2>
                <p className="case-desc">{study.description}</p>
              </div>
              <button 
                className="option-btn start-btn"
                onClick={() => setActiveCaseStudyId(study.id)}
              >
                Start Scenario
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="scenario-wrapper">
          <Scenario 
            data={activeCaseStudy} 
            onFinish={() => setActiveCaseStudyId(null)} 
          />
        </div>
      )}
    </div>
  );
}

export default App;
