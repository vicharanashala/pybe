import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Scene({ sceneClasses, onTryItOut, hideButton }) {
  return (
    <div id="scene" className={`scene-container ${sceneClasses || ""}`}>
      {/* --- LEFT COLUMN: Animation --- */}
      <div className="scene-animation">
        <DotLottieReact
          src="https://lottie.host/2f1ab0c2-e939-479b-909e-a22bc47846ec/TLaYG61JfD.lottie"
          loop
          autoplay
          className="scene-lottie"
        />
      </div>

      {/* --- RIGHT COLUMN: Scenario Text & Call to Action --- */}
      <div className="scene-content">
        <span className="scene-label">Scenario</span>

        <h2 className="scene-heading">
          Manage Team India & Master Python- Classes
        </h2>

        <p className="scene-description">
          Step into the shoes of the Indian Cricket Team manager! You’ll input details for players like their batting style, bowling stats, and match records. As you build your roster, you'll see how a single blueprint (a <strong>Python Class</strong>) easily creates distinct profiles for every cricketer on the team.
        </p>

        {!hideButton && (
          <div className="try-btn-wrap inline">
            <button className="gold big scene-cta-btn" onClick={onTryItOut}>
              Try it out →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}