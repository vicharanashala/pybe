import React from 'react';
import { Lock, Sparkles, BookOpen, Shield, Dna } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/heroAcademy.css';

export default function AdventureSelector({
  activeCaseStudy = 'encapsulation',
  onSelectCaseStudy
}) {
  const caseStudies = [
    {
      id: 'encapsulation',
      num: 1,
      title: 'Encapsulation',
      icon: '🔒',
      subtitle: "Buddy's Magic Pet Shop",
      activeClass: 'active-cs1',
      badgeColor: '#D97706',
      completed: false
    },
    {
      id: 'inheritance',
      num: 2,
      title: 'Inheritance',
      icon: '🧬',
      subtitle: 'Future Scope',
      locked: true
    },
    {
      id: 'polymorphism',
      num: 3,
      title: 'Polymorphism',
      icon: '🎭',
      subtitle: 'Future Scope',
      locked: true
    },
    {
      id: 'abstraction',
      num: 4,
      title: 'Abstraction',
      icon: '🔮',
      subtitle: 'Future Scope',
      locked: true
    }
  ];

  const handleSelect = (cs) => {
    if (cs.locked) {
      SoundService.playSadWobble();
      return;
    }
    SoundService.playPop();
    if (onSelectCaseStudy) {
      onSelectCaseStudy(cs.id);
    }
  };

  return (
    <nav className="adventure-hub-bar" aria-label="OOP Case Studies Navigation">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '6px', color: '#94A3B8', fontSize: '0.85rem', fontWeight: 700 }}>
        <BookOpen size={16} color="#38BDF8" />
        <span>OOP ADVENTURES:</span>
      </div>

      {caseStudies.map((cs) => {
        const isActive = activeCaseStudy === cs.id;

        return (
          <button
            key={cs.id}
            className={`btn-case-study-tab ${isActive ? cs.activeClass : ''} ${cs.locked ? 'locked' : ''}`}
            onClick={() => handleSelect(cs)}
            title={cs.locked ? `${cs.title} (Locked Adventure)` : `${cs.title}: ${cs.subtitle}`}
          >
            <span>{cs.icon}</span>
            <span>Case Study {cs.num}: {cs.title}</span>
            {cs.isNew && !isActive && (
              <span style={{ background: '#38BDF8', color: '#0F172A', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '999px' }}>
                NEW
              </span>
            )}
            {cs.completed && cs.id !== activeCaseStudy && (
              <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 700 }}>✓</span>
            )}
            {cs.locked && <Lock size={12} style={{ opacity: 0.6 }} />}
          </button>
        );
      })}
    </nav>
  );
}
