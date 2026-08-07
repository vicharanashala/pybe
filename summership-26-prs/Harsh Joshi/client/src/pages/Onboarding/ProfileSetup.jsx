import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, User, Calendar } from 'lucide-react';

// Kid-friendly category keywords for age-based sorting (8-15)
const KID_FRIENDLY_DOMAINS = [
  'pets', 'magic', 'super', 'heroes', 'space', 'dinosaurs', 'robots', 
  'fairies', 'ninjas', 'spies', 'dragons', 'unicorns', 'games', 'food', 
  'sports', 'pirate', 'ocean', 'castle', 'wizard', 'puppy'
];

export default function ProfileSetup({ onComplete }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check localStorage for existing profile
    const existing = localStorage.getItem('pybe_user');
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (parsed && parsed.name) {
          onComplete();
          return;
        }
      } catch (e) {
        // invalid JSON in storage, continue with onboarding
      }
    }

    // Fetch 50 categories from backend
    fetch('/api/personalized/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setCategories(data.data);
        } else {
          // Fallback categories if backend array is empty
          setCategories([
            { id: "pets", name: "Pets & Animals", domain: "the dog park" },
            { id: "magic", name: "Wizard School", domain: "the enchanted castle" },
            { id: "heroes", name: "Superheroes", domain: "the mega city" },
            { id: "space", name: "Space Exploration", domain: "the red planet" },
            { id: "dinosaurs", name: "Dino World", domain: "the prehistoric jungle" },
            { id: "games", name: "Video Games", domain: "the pixel arena" },
            { id: "robots", name: "Robotics Lab", domain: "the tech hub" },
            { id: "culture", name: "World History", domain: "the ancient archives" },
            { id: "society", name: "Modern Architecture", domain: "the metropolis" }
          ]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load categories:", err);
        setCategories([
          { id: "pets", name: "Pets & Animals", domain: "the dog park" },
          { id: "magic", name: "Wizard School", domain: "the enchanted castle" },
          { id: "heroes", name: "Superheroes", domain: "the mega city" },
          { id: "space", name: "Space Exploration", domain: "the red planet" },
          { id: "dinosaurs", name: "Dino World", domain: "the prehistoric jungle" },
          { id: "games", name: "Video Games", domain: "the pixel arena" }
        ]);
        setLoading(false);
      });
  }, [onComplete]);

  // Age-based sorting algorithm
  const sortedCategories = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const numAge = parseInt(age, 10);
    const isKid = !isNaN(numAge) && numAge >= 8 && numAge <= 15;

    return [...categories].sort((a, b) => {
      const aText = `${a.id} ${a.name} ${a.domain}`.toLowerCase();
      const bText = `${b.id} ${b.name} ${b.domain}`.toLowerCase();
      const aIsKid = KID_FRIENDLY_DOMAINS.some(k => aText.includes(k));
      const bIsKid = KID_FRIENDLY_DOMAINS.some(k => bText.includes(k));

      if (isKid) {
        if (aIsKid && !bIsKid) return -1;
        if (!aIsKid && bIsKid) return 1;
      } else if (!isNaN(numAge) && numAge > 15) {
        if (!aIsKid && bIsKid) return -1;
        if (aIsKid && !bIsKid) return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [categories, age]);

  const toggleInterest = (id) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!age || isNaN(age) || Number(age) < 4 || Number(age) > 120) {
      setError("Please enter a valid age between 4 and 120.");
      return;
    }
    if (selectedInterests.length < 5) {
      setError("Please select at least 5 topics from the grid that interest you.");
      return;
    }

    setSubmitting(true);
    const userProfile = {
      name: name.trim(),
      age: Number(age),
      interests: selectedInterests,
      completedTopics: [],
      score: 0,
      level: 1,
      selectedTheme: selectedInterests[0] || 'pets'
    };

    try {
      // Frictionless persistence to localStorage
      localStorage.setItem('pybe_user', JSON.stringify(userProfile));

      // Post to backend endpoint /api/users/profile
      await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
      });
    } catch (err) {
      console.warn("Backend profile sync failed, relying on localStorage:", err);
    } finally {
      setSubmitting(false);
      onComplete();
    }
  };

  if (loading) {
    return <div className="panel" style={{ padding: '3rem', textAlign: 'center' }}>Loading your personalized onboarding...</div>;
  }

  return (
    <div className="panel onboarding-container" style={{ maxWidth: '900px', margin: '2rem auto', padding: '2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Sparkles size={40} style={{ color: '#ec4899', margin: '0 auto 1rem' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome to PyBe! 🚀</h1>
        <p style={{ color: 'var(--text-muted)' }}>Let's personalize your Python learning journey based on your favorite worlds.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              <User size={16} style={{ display: 'inline', marginRight: '6px' }} /> What is your name?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Alex"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} /> How old are you? (Sorts topics for you!)
            </label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="e.g., 10"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-subtle)', color: 'var(--text)' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Select at least 5 favorite worlds or topics ({selectedInterests.length}/5 selected):
          </label>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {Number(age) >= 8 && Number(age) <= 15 ? "✨ We prioritized kid-friendly topics like Pets, Superheroes, and Space at the top for you!" : "✨ Choose the universes where you want to write your Python code."}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {sortedCategories.map(cat => {
              const isSelected = selectedInterests.includes(cat.id || cat.name);
              return (
                <div
                  key={cat.id || cat.name}
                  onClick={() => toggleInterest(cat.id || cat.name)}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #ec4899' : '1px solid var(--border)',
                    background: isSelected ? 'rgba(236, 72, 153, 0.1)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>{cat.name}</strong>
                  {cat.domain && <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{cat.domain}</small>}
                  {isSelected && <CheckCircle2 size={18} style={{ position: 'absolute', top: '10px', right: '10px', color: '#ec4899' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: submitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {submitting ? 'Setting up your universe...' : 'Launch My Python Journey!'} <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
}
