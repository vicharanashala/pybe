import React, { useState } from 'react';
import BuddyCharacter from './BuddyCharacter';
import LunaTeacher from './LunaTeacher';
import CapsuleHero from './CapsuleHero';
import { Shield, Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import '../styles/cartoonStage.css';
import '../styles/characterRigs.css';

export default function PetShopStage({
  theme = 'shop-front',
  doorOpen = false,
  buddy = {},
  luna = {},
  capsule = {},
  tamperEvent = null,
  flyingProp = null,
  stageProps = {}
}) {
  const [activeSetterTest, setActiveSetterTest] = useState(null);

  const handleTestSetter = (val, isValid, message) => {
    setActiveSetterTest({ val, isValid, message });
  };

  return (
    <div className={`cartoon-stage theme-${theme}`}>
      {/* Sky & Clouds Parallax Layer */}
      <div className="stage-sky">
        <div className="stage-sun" />
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
      </div>

      {/* Ground & Rug */}
      <div className="stage-ground">
        <div className="pet-carpet" />
      </div>

      {/* Shop Door Frame (Scene 1) */}
      <div className="shop-door-frame">
        <div className={`shop-door-panel ${doorOpen ? 'open' : ''}`}>
          <div className="door-knob" />
        </div>
      </div>

      {/* 📄 Scene 3: Messy Loose Variables Clutter */}
      {stageProps?.messyVars && (
        <div className="messy-variables-overlay">
          <div className="messy-tag tag-1">buddy_name = "Buddy"</div>
          <div className="messy-tag tag-2">buddy_health = 100</div>
          <div className="messy-tag tag-3">buddy_happiness = 70</div>
          <div className="messy-tag tag-4">bella_name = "Bella"</div>
          <div className="messy-tag tag-5">bella_health = 90</div>
          <div className="messy-tag tag-6">bella_happiness = 85</div>
          <div className="messy-tag tag-7">max_name = "Max"</div>
          <div className="messy-tag tag-8">rocky_health = 60</div>
          <div className="messy-tag tag-9">daisy_happiness = 95</div>
          <div className="messy-tag tag-10">... 30+ loose variables! 😱</div>
        </div>
      )}

      {/* 📦 Scene 4: Bundled Entity Box */}
      {stageProps?.bundledObject && (
        <div className="bundled-object-card">
          <div className="bundled-card-header">
            🐶 <strong>ONE IDENTITY: BUDDY</strong>
          </div>
          <div className="bundled-card-items">
            <span className="bundle-chip">Name: "Buddy"</span>
            <span className="bundle-chip">Health: 100</span>
            <span className="bundle-chip">Happiness: 70</span>
          </div>
        </div>
      )}

      {/* 🌳 Scene 5: Information + Action Structure Tree */}
      {stageProps?.showBehaviorTree && (
        <div className="behavior-tree-card">
          <div className="tree-header">🐶 Buddy's Unified Structure</div>
          <div className="tree-content">
            <div className="tree-col">
              <span className="tree-label">HAS Information:</span>
              <span className="tree-item">📝 name</span>
              <span className="tree-item">❤️ health</span>
              <span className="tree-item">😊 happiness</span>
            </div>
            <div className="tree-divider" />
            <div className="tree-col">
              <span className="tree-label">CAN DO Actions:</span>
              <span className="tree-item">🍎 eat()</span>
              <span className="tree-item">🎾 play()</span>
              <span className="tree-item">💚 heal()</span>
            </div>
          </div>
        </div>
      )}

      {/* 📋 Scene 6 & 7: Physical Pet Record Card */}
      {stageProps?.petCard && (
        <div className={`pet-record-card ${stageProps.blueprintGlow ? 'blueprint-glow' : ''}`}>
          <div className="pet-card-badge">🐾 OFFICIAL PET SHOP RECORD</div>
          <div className="pet-card-name">🐶 BUDDY'S PET CARD</div>
          <div className="pet-card-section">
            <strong>Information (Data):</strong>
            <div className="pet-card-stats">
              <span>Name: Buddy</span>
              <span>Health: 100 ❤️</span>
              <span>Happiness: 70 😊</span>
            </div>
          </div>
          <div className="pet-card-section">
            <strong>Allowed Actions (Care):</strong>
            <div className="pet-card-actions">
              <span className="action-pill">🍎 Feed</span>
              <span className="action-pill">🎾 Play</span>
              <span className="action-pill">💚 Heal</span>
            </div>
          </div>
        </div>
      )}

      {/* 🔒 Scene 9 & 17: Grand Encapsulation Title Banner */}
      {stageProps?.showEncapsulationTitle && (
        <div className="encapsulation-grand-banner">
          <span className="banner-icon">🔒</span>
          <div className="banner-text">
            <h2>ENCAPSULATION</h2>
            <p>Data + Methods bundled together with internal protection!</p>
          </div>
          <span className="banner-icon">✨</span>
        </div>
      )}

      {/* 🚪 Scene 12: Controlled Request Flow: OUTSIDE -> heal(20) -> BUDDY -> HEALTH */}
      {stageProps?.requestFlow && (
        <div className="request-flow-banner">
          <div className="flow-step outside">
            <span>OUTSIDE</span>
            <code>buddy.heal(20)</code>
          </div>
          <div className="flow-arrow">➡️</div>
          <div className="flow-step check">
            <span>🛡️ VALIDATION</span>
            <code>if amount &gt; 0:</code>
          </div>
          <div className="flow-arrow">➡️</div>
          <div className="flow-step buddy">
            <span>🐶 BUDDY</span>
            <code>self.__health = 100</code>
          </div>
        </div>
      )}

      {/* 🔍 Scene 13: Getter/Setter Validation Gatekeeper Sandbox */}
      {stageProps?.setterTester && (
        <div className="setter-tester-card">
          <div className="setter-tester-title">
            🛡️ Setter Validation Gate: <code>set_health(value)</code>
          </div>
          <div className="setter-tester-buttons">
            <button
              className="btn-tester valid"
              onClick={() => handleTestSetter(80, true, "✅ 80 is between 0 and 100! Health updated to 80!")}
            >
              Test: set_health(80)
            </button>
            <button
              className="btn-tester invalid"
              onClick={() => handleTestSetter(500, false, "❌ 500 is too high! Blocked by setter rule!")}
            >
              Test: set_health(500)
            </button>
            <button
              className="btn-tester invalid"
              onClick={() => handleTestSetter(-20, false, "❌ -20 is negative! Blocked by setter rule!")}
            >
              Test: set_health(-20)
            </button>
          </div>
          {activeSetterTest && (
            <div className={`setter-result-pill ${activeSetterTest.isValid ? 'valid' : 'invalid'}`}>
              {activeSetterTest.message}
            </div>
          )}
        </div>
      )}

      {/* 🌟 Scene 17: Final Reflection Takeaway Cards */}
      {stageProps?.showReflection && (
        <div className="reflection-cards-row">
          <div className="reflection-card">
            <span className="ref-icon">🔹</span>
            <span>Related information stays together in one object.</span>
          </div>
          <div className="reflection-card">
            <span className="ref-icon">🔹</span>
            <span>The object controls how important data changes.</span>
          </div>
          <div className="reflection-card">
            <span className="ref-icon">🔹</span>
            <span>Python gives us classes, methods, and access rules.</span>
          </div>
        </div>
      )}

      {/* Tamper Event Banner (Scene 10) */}
      {tamperEvent && (
        <div className={`tamper-event-box ${tamperEvent.danger ? 'danger' : ''}`}>
          <span style={{ fontSize: '1.4rem' }}>{tamperEvent.blocked ? '🛡️' : '⚠️'}</span>
          <span style={{ fontFamily: 'JetBrains Mono', color: tamperEvent.danger ? '#F87171' : (tamperEvent.blocked ? '#4ADE80' : '#FDE047'), fontWeight: 700, fontSize: '1.15rem' }}>
            {tamperEvent.text}
          </span>
        </div>
      )}

      {/* Flying Interactive Props (Scene 14: Bone, Ball, Blanket, Candies) */}
      {flyingProp && (
        <div
          className={`flying-prop ${flyingProp.eating ? 'eating' : ''}`}
          style={{
            left: `${flyingProp.x}%`,
            top: `${flyingProp.y}%`,
            transform: `scale(${flyingProp.scale || 1}) rotate(${flyingProp.rotate || 0}deg)`
          }}
        >
          {flyingProp.icon}
        </div>
      )}

      {/* Stage Actors with Real Physical Coordinates */}
      {/* 1. Teacher Luna */}
      {luna && luna.visible !== false && (
        <div
          className="stage-actor"
          style={{
            left: `${luna.x !== undefined ? luna.x : 75}%`,
            bottom: `${luna.y !== undefined ? luna.y : 30}px`,
            opacity: luna.opacity !== undefined ? luna.opacity : 1
          }}
        >
          <LunaTeacher
            action={luna.action || 'waving'}
            scaleX={luna.scaleX || 1}
          />
        </div>
      )}

      {/* 2. Buddy the Magical Puppy */}
      {buddy && buddy.visible !== false && (
        <div
          className="stage-actor"
          style={{
            left: `${buddy.x !== undefined ? buddy.x : 45}%`,
            bottom: `${buddy.y !== undefined ? buddy.y : 30}px`,
            opacity: buddy.opacity !== undefined ? buddy.opacity : 1
          }}
        >
          <BuddyCharacter
            action={buddy.action || 'idle'}
            mood={buddy.mood || 'joyful'}
            health={buddy.health !== undefined ? buddy.health : 100}
            happiness={buddy.happiness !== undefined ? buddy.happiness : 70}
            energy={buddy.energy !== undefined ? buddy.energy : 90}
            hasCape={buddy.hasCape || false}
            showStats={buddy.showStats !== undefined ? buddy.showStats : true}
            scaleX={buddy.scaleX || 1}
          />
        </div>
      )}

      {/* 3. Capsule the Hero (Appears in Scene 11+) */}
      {capsule && capsule.visible && (
        <div
          className="stage-actor"
          style={{
            left: `${capsule.x !== undefined ? capsule.x : 20}%`,
            bottom: `${capsule.y !== undefined ? capsule.y : 30}px`,
            opacity: capsule.opacity !== undefined ? capsule.opacity : 1
          }}
        >
          <CapsuleHero
            action={capsule.action || 'hover'}
            shieldActive={capsule.shieldActive !== undefined ? capsule.shieldActive : true}
            lockOpen={capsule.lockOpen || false}
          />
        </div>
      )}
    </div>
  );
}
