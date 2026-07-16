import React from 'react';

const BAND_ORDER = ['Beginner', 'Developing', 'Proficient', 'Mastered'];

/**
 * Feature 10: Concept Mastery Prediction. One row per category, a
 * confidence bar, and the predicted band.
 */
function MasteryChart({ mastery }) {
  if (!mastery?.length) return null;

  return (
    <div className="mastery-chart">
      {mastery.map((item) => (
        <div className="mastery-row" key={item.category}>
          <div className="mastery-row-header">
            <span>{item.category}</span>
            <span className={`mastery-band band-${item.band.toLowerCase()}`}>{item.band}</span>
          </div>
          <div className="mastery-track">
            <div className="mastery-fill" style={{ width: `${item.confidence}%` }} />
            <div className="mastery-band-ticks">
              {BAND_ORDER.map((band, index) => (
                <span key={band} style={{ left: `${(index / BAND_ORDER.length) * 100}%` }} />
              ))}
            </div>
          </div>
          <p className="mastery-recommendation">{item.recommendation}</p>
        </div>
      ))}
    </div>
  );
}

export default MasteryChart;
