import React, { useState } from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter1StoryIntro({ chapter, onContinue }) {
  const [activeTab, setActiveTab] = useState('durga');

  return (
    <section className="screen screen-story" aria-labelledby="chapter1-heading">
      <div className="story-container">
        <header className="screen-header">
          <span className="screen-eyebrow">{chapter.eyebrow}</span>
          <h2 id="chapter1-heading" className="screen-title">{chapter.title}</h2>
          <p className="screen-lead">
            Dasara brings diverse communities together across India, each celebrating the triumph of good, light, and resilience through vibrant traditions.
          </p>
        </header>

        {/* Narrative Paragraphs */}
        <div className="story-text-card">
          {chapter.paragraphs.map((p, idx) => (
            <p key={idx} className="story-para">{p}</p>
          ))}
        </div>

        {/* Interactive Regional Tradition Tabs */}
        <div className="traditions-panel">
          <h3 className="panel-title">Explore Regional Celebrations &amp; Narratives</h3>
          <div className="tab-buttons" role="tablist" aria-label="Regional traditions">
            <button
              role="tab"
              aria-selected={activeTab === 'durga'}
              aria-controls="tab-durga"
              className={`tab-btn ${activeTab === 'durga' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveTab('durga');
              }}
            >
              🌺 Durga &bull; Mahishasura Tradition
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'rama'}
              aria-controls="tab-rama"
              className={`tab-btn ${activeTab === 'rama' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveTab('rama');
              }}
            >
              🏹 Rama &bull; Ravana Tradition
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'cultural'}
              aria-controls="tab-cultural"
              className={`tab-btn ${activeTab === 'cultural' ? 'active' : ''}`}
              onClick={() => {
                sound.playClick();
                setActiveTab('cultural');
              }}
            >
              🪔 Living Cultural Observances
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'durga' && (
              <div id="tab-durga" role="tabpanel" className="tradition-card fade-in">
                <h4>Goddess Durga &amp; Mahishasura</h4>
                <p>
                  Observed extensively across Eastern and Southern India. Over nine days and nights, Goddess Durga confronts the shape-shifting buffalo demon Mahishasura, who believed no force could defeat him.
                  On the tenth day, <strong>Vijayadashami</strong>, good triumphs over arrogance.
                </p>
                <div className="tradition-highlight">
                  <span>🏛️ <strong>Mysuru Dasara:</strong> The famous Jamboo Savari elephant procession carries the idol of Goddess Chamundeshwari through illuminated palace grounds.</span>
                </div>
              </div>
            )}

            {activeTab === 'rama' && (
              <div id="tab-rama" role="tabpanel" className="tradition-card fade-in">
                <h4>Rama &amp; Ravana</h4>
                <p>
                  Celebrated across Northern, Western, and Central regions as Dussehra. Commemorates Rama's journey to Lanka with Lakshmana, Hanuman, and the Vanara army, culminating in the defeat of Ravana.
                </p>
                <div className="tradition-highlight">
                  <span>🎭 <strong>Ramlila &amp; Effigies:</strong> In cities like Ayodhya, Varanasi, and Delhi, dramatic enactments of the Ramayana conclude with the burning of colossal Ravana effigies.</span>
                </div>
              </div>
            )}

            {activeTab === 'cultural' && (
              <div id="tab-cultural" role="tabpanel" className="tradition-card fade-in">
                <h4>Bommai Kolu, Ayudha Puja &amp; Vidyarambham</h4>
                <p>
                  Dasara is enriched with living family and community rituals across regions:
                </p>
                <ul className="tradition-list">
                  <li><strong>Bommai Kolu / Golu:</strong> Elaborate stepped doll displays in South Indian households representing heritage, stories, and social life.</li>
                  <li><strong>Ayudha Puja:</strong> Worship of tools, books, musical instruments, vehicles, and software workstations in gratitude for sustenance.</li>
                  <li><strong>Vidyarambham:</strong> Initiation of young children into reading, writing, and knowledge on Vijayadashami day.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Cultural Respect Note */}
        <div className="cultural-disclaimer">
          <span>{chapter.culturalNote}</span>
        </div>

        {/* Call to Action */}
        <div className="story-cta-box">
          <p className="cta-prompt">Ready to see how these stories connect to building resilient software?</p>
          <button
            className="btn btn-primary btn-md"
            onClick={() => {
              sound.playSuccess();
              onContinue();
            }}
          >
            Enter Chapter II: The Arrogance of Certainty &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
