import React, { useState, useEffect } from 'react';
import InteractiveView from '../Learning/InteractiveView';

// Mapping vibrant emoji icons for kid-friendly worlds
const CATEGORY_ICONS = {
  pets: "🐶", heroes: "🦸‍♂️", games: "🎮", space: "🚀", magic: "🧙‍♂️",
  food: "🍕", sports: "⚽", pirate: "🏴‍☠️", dinosaurs: "🦖", robots: "🤖",
  ocean: "🐬", fairies: "🧚‍♀️", ninjas: "🥷", spies: "🕵️‍♂️", vampires: "🧛‍♂️",
  dragons: "🐉", unicorns: "🦄", culture: "📜", popculture: "🎬", music: "🥁",
  society: "🏙️", default: "🌟"
};

const TOPICS = [
  { id: 'loop', label: 'While Loops 🔁' },
  { id: 'var', label: 'Variables 📦' },
  { id: 'cond', label: 'If/Else Logic 🔀' },
  { id: 'list', label: 'Lists & Inventories 🎒' },
  { id: 'func', label: 'Magic Functions ✨' }
];

export default function PersonalizedJourney() {
  const [categories, setCategories] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('loop');
  const [loading, setLoading] = useState(false);
  const [caseStudy, setCaseStudy] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all 50 categories from the backend
    fetch('/api/personalized/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setCategories(data.data);
        } else {
          // Fallback initial categories if offline or still initializing
          setCategories([
            { id: "pets", name: "Pets & Animals", domain: "the dog park", character: "a playful puppy" },
            { id: "heroes", name: "Superheroes", domain: "the mega city", character: "Super Kid" },
            { id: "games", name: "Video Games", domain: "the pixel arena", character: "a cyber gamer" },
            { id: "space", name: "Space Exploration", domain: "the red planet", character: "an astronaut" },
            { id: "magic", name: "Wizard School", domain: "the enchanted castle", character: "a young wizard" },
            { id: "food", name: "Busy Bakery", domain: "the sweet kitchen", character: "a master baker" },
            { id: "sports", name: "Championship Sports", domain: "the grand stadium", character: "a star athlete" },
            { id: "pirate", name: "Pirate Ocean", domain: "the treasure island", character: "Captain Bluebeard" }
          ]);
        }
      })
      .catch(err => {
        console.error("Failed to load categories:", err);
        setCategories([
          { id: "pets", name: "Pets & Animals", domain: "the dog park", character: "a playful puppy" },
          { id: "heroes", name: "Superheroes", domain: "the mega city", character: "Super Kid" },
          { id: "games", name: "Video Games", domain: "the pixel arena", character: "a cyber gamer" },
          { id: "space", name: "Space Exploration", domain: "the red planet", character: "an astronaut" },
          { id: "magic", name: "Wizard School", domain: "the enchanted castle", character: "a young wizard" }
        ]);
      });
  }, []);

  const handleTileClick = async (cat) => {
    setLoading(true);
    setError(null);
    setCaseStudy(null);

    try {
      const response = await fetch('/api/personalized/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: cat.id,
          topic: selectedTopic,
          userId: 'guest_user'
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to generate learning session");
      }

      setCaseStudy(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.character.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If a session is active, render the Side-by-Side Interactive View!
  if (caseStudy) {
    return <InteractiveView caseStudy={caseStudy} onReset={() => setCaseStudy(null)} />;
  }

  return (
    <div style={styles.container}>
      {/* Banner */}
      <header style={styles.header}>
        <div style={styles.badge}>⚡ PyBe Antigravity 2.0</div>
        <h1 style={styles.title}>The 50 Worlds Discovery Grid</h1>
        <p style={styles.subtitle}>
          Select a universe below. The <strong>Adaptive Pedagogical Engine</strong> will automatically evaluate your engagement and calibrate your scaffolding difficulty in real-time.
        </p>
      </header>

      {/* Topic Selector Filter Bar */}
      <div style={styles.filterSection}>
        <div style={styles.filterTitle}>🎯 Choose Core Python Concept:</div>
        <div style={styles.pillContainer}>
          {TOPICS.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              style={selectedTopic === t.id ? styles.activePill : styles.pill}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Search worlds by name, domain, or hero..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <strong>Error loading universe:</strong> {error}
        </div>
      )}

      {loading && (
        <div style={styles.loadingBox}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀 ✨ 🌌</div>
          <h3>Warping to your selected universe...</h3>
          <p style={{ color: '#94a3b8' }}>Generating side-by-side pseudocode and adaptive practice challenges.</p>
        </div>
      )}

      {/* Massive 50-Category CSS Grid */}
      {!loading && (
        <div style={styles.gridContainer}>
          {filteredCategories.map((cat, idx) => {
            const icon = CATEGORY_ICONS[cat.id.split('_')[0]] || CATEGORY_ICONS.default;
            return (
              <div
                key={cat.id || idx}
                style={styles.card}
                onClick={() => handleTileClick(cat)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 25px rgba(56, 189, 248, 0.3)';
                  e.currentTarget.style.borderColor = '#38bdf8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  e.currentTarget.style.borderColor = '#334155';
                }}
              >
                <div style={styles.cardIcon}>{icon}</div>
                <h3 style={styles.cardTitle}>{cat.name}</h3>
                <div style={styles.cardDetail}>
                  <span>📍 Domain: </span><strong style={{ color: '#e2e8f0' }}>{cat.domain}</strong>
                </div>
                <div style={styles.cardDetail}>
                  <span>🦸 Hero: </span><strong style={{ color: '#7dd3fc' }}>{cat.character}</strong>
                </div>
                <div style={styles.cardFooter}>
                  <span>Explore {TOPICS.find(t => t.id === selectedTopic)?.label.split(' ')[0]} →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    minHeight: '100vh',
    padding: '2.5rem 2rem',
    fontFamily: "'Inter', 'Roboto', sans-serif"
  },
  header: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto 2.5rem'
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#0284c7',
    color: '#fff',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '1rem',
    boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)'
  },
  title: {
    fontSize: '2.75rem',
    fontWeight: '800',
    margin: '0 0 1rem',
    background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    lineHeight: '1.6'
  },
  filterSection: {
    backgroundColor: '#1e293b',
    padding: '1.5rem 2rem',
    borderRadius: '16px',
    border: '1px solid #334155',
    maxWidth: '1000px',
    margin: '0 auto 2.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
  },
  filterTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: '1rem'
  },
  pillContainer: {
    display: 'flex',
    gap: '0.8rem',
    flexWrap: 'wrap',
    marginBottom: '1.5rem'
  },
  pill: {
    backgroundColor: '#0f172a',
    color: '#94a3b8',
    border: '1px solid #334155',
    padding: '0.6rem 1.2rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  },
  activePill: {
    backgroundColor: '#0284c7',
    color: '#fff',
    border: '1px solid #38bdf8',
    padding: '0.6rem 1.2rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
    transform: 'scale(1.03)'
  },
  searchContainer: {
    width: '100%'
  },
  searchInput: {
    width: '100%',
    padding: '0.8rem 1.2rem',
    borderRadius: '10px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid #334155',
    cursor: 'pointer',
    transition: 'all 0.25s ease-out',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  cardIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.8rem'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#f8fafc',
    margin: '0 0 0.8rem'
  },
  cardDetail: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    marginBottom: '0.4rem'
  },
  cardFooter: {
    marginTop: '1.2rem',
    paddingTop: '0.8rem',
    borderTop: '1px solid #334155',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#38bdf8',
    textAlign: 'right'
  },
  loadingBox: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    maxWidth: '600px',
    margin: '2rem auto',
    border: '1px solid #334155'
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    color: '#fef2f2',
    padding: '1.2rem',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto 2rem',
    textAlign: 'center',
    border: '1px solid #b91c1c'
  }
};
