import React, { useState, useMemo } from 'react';
import { X, BookOpen, Network, Sparkles, CheckCircle, Search, Filter, Award, Code, Layers } from 'lucide-react';

export default function SakshamStoriesModal({ onClose, scenarios, onSelectScenario, onGenerateConceptMap, onGenerateSkeleton }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'asis', 'interactive', 'loops', 'conditionals', 'datatypes'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only Saksham's verified stories from the DB scenarios array
  const sakshamStories = useMemo(() => {
    return (scenarios || []).filter((s) => {
      const title = (s.title || '').toLowerCase();
      const concepts = Array.isArray(s.concepts) ? s.concepts.join(' ').toLowerCase() : (s.concepts || '').toLowerCase();
      return title.includes('saksham') || title.includes('[as is]') || concepts.includes('saksham');
    });
  }, [scenarios]);

  // Apply tab filter and search filter
  const filteredStories = useMemo(() => {
    return sakshamStories.filter((s) => {
      const title = (s.title || '').toLowerCase();
      const concepts = Array.isArray(s.concepts) ? s.concepts.join(' ').toLowerCase() : (s.concepts || '').toLowerCase();
      const text = (s.context || s.prompt || '').toLowerCase();
      
      // Search check
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!title.includes(q) && !text.includes(q) && !concepts.includes(q)) {
          return false;
        }
      }

      // Tab check
      if (activeTab === 'loops') return title.includes('loops') || concepts.includes('loops') || title.includes('l1') || title.includes('l2');
      if (activeTab === 'conditionals') return title.includes('conditionals') || concepts.includes('conditionals') || title.includes('c1') || title.includes('c2');
      if (activeTab === 'datatypes') return title.includes('data') || concepts.includes('datatypes') || title.includes('dt');
      
      return true;
    });
  }, [sakshamStories, activeTab, searchQuery]);

  // Clean snippet generator
  const getExcerpt = (story) => {
    if (!story) return '';
    let text = story.prompt || story.context || '';
    // Strip markdown formatting tags like ### Scenario or ---PAGE---
    text = text.replace(/###.*?(\n|$)/g, '').replace(/---PAGE---/g, '').trim();
    if (text.length > 180) {
      return text.slice(0, 180) + '...';
    }
    return text || 'Interactive Python logic scenario contributed by Saksham Sharma.';
  };

  const getDifficultyColor = (diff) => {
    switch ((diff || '').toLowerCase()) {
      case 'beginner': return '#10b981'; // Green
      case 'intermediate': return '#f59e0b'; // Amber
      case 'advanced': return '#ef4444'; // Red
      default: return '#8b5cf6'; // Purple
    }
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 5, 15, 0.85)', backdropFilter: 'blur(10px)', padding: '20px' }}>
      <div 
        className="modal" 
        style={{ 
          maxWidth: '960px', 
          width: '100%', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          background: '#0d0d21', 
          border: '1px solid rgba(168, 85, 247, 0.4)', 
          borderRadius: '20px', 
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(168, 85, 247, 0.15)',
          overflow: 'hidden',
          color: '#f8fafc',
          position: 'relative'
        }}
      >
        {/* Top Gradient Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0d0d21 100%)', padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
          <button 
            onClick={onClose} 
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            title="Close modal"
          >
            <X size={20} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.18)', border: '1px solid #10b981', color: '#34d399', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              <CheckCircle size={14} /> VERIFIED BY GITHUB PR (summership-26-prs)
            </span>
            <span style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
              {sakshamStories.length} Scenarios Loaded
            </span>
          </div>

          <h2 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff' }}>
            <Award size={32} style={{ color: '#facc15' }} /> 
            Saksham Sharma's Verified Case Studies
          </h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.5', maxWidth: '82%' }}>
            Explore the original real-world Python scenarios contributed by Saksham Sharma. Generate instant visual concept maps or practice logical deduction without altering his original narrative!
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Stories (27)', icon: Layers },
              { id: 'loops', label: '🔁 Loops', icon: null },
              { id: 'conditionals', label: '🔀 Conditionals', icon: null },
              { id: 'datatypes', label: '📦 Data Types', icon: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#fff' : '#94a3b8',
                    border: isActive ? '1px solid #a78bfa' : '1px solid rgba(255,255,255,0.08)',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 4px 12px rgba(124, 58, 237, 0.4)' : 'none'
                  }}
                >
                  {Icon && <Icon size={14} />}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px', flexGrow: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search Saksham's stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Stories Scrollable Grid */}
        <div style={{ padding: '24px 32px', overflowY: 'auto', flexGrow: 1, maxHeight: 'calc(90vh - 210px)' }}>
          {filteredStories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <Filter size={48} style={{ opacity: 0.3, margin: '0 auto 16px auto', display: 'block' }} />
              <p style={{ fontSize: '1.1rem', margin: 0 }}>No stories match your current tab or search query.</p>
              <button onClick={() => { setActiveTab('all'); setSearchQuery(''); }} style={{ marginTop: '12px', background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' }}>
              {filteredStories.map((story) => {
                const diffColor = getDifficultyColor(story.difficulty);
                const isAsIs = (story.title || '').includes('[AS IS]');
                
                return (
                  <div
                    key={story.id}
                    style={{
                      background: 'linear-gradient(160deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div>
                      {/* Top Badge Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 9px', borderRadius: '6px', background: `${diffColor}22`, color: diffColor, border: `1px solid ${diffColor}55`, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {story.difficulty || 'Intermediate'}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                          ⚡ 3-STAGE INTERACTIVE PUZZLE
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.15rem', fontWeight: 700, color: '#f1f5f9', lineHeight: '1.4' }}>
                        {story.title}
                      </h3>

                      {/* Excerpt */}
                      <p style={{ margin: '0 0 18px 0', fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.5', minHeight: '42px' }}>
                        {getExcerpt(story)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <button
                        onClick={() => {
                          onSelectScenario(story);
                        }}
                        style={{
                          flex: 1,
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#e2e8f0',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.color = '#e2e8f0'; }}
                        title="Load this story into the interactive practice workspace"
                      >
                        <BookOpen size={16} style={{ color: '#a78bfa' }} />
                        <span>Open Workspace</span>
                      </button>

                      <button
                        onClick={() => {
                          onGenerateConceptMap(story);
                        }}
                        style={{
                          flex: 1.25,
                          background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 15px rgba(13, 148, 136, 0.35)',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 148, 136, 0.5)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(13, 148, 136, 0.35)'; }}
                        title="Directly create the 3-Zone Visual Concept Map out of this exact story as it is"
                      >
                        <Network size={17} style={{ color: '#67e8f9' }} />
                        <span>Concept Map</span>
                      </button>

                      {onGenerateSkeleton && (
                        <button
                          onClick={() => onGenerateSkeleton(story)}
                          style={{
                            flex: 1.25,
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.35)',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.35)'; }}
                          title="Apply Skeleton Scan and Actor-Action Matrix methods to generate code logic scanner"
                        >
                          <Layers size={17} style={{ color: '#38bdf8' }} />
                          <span>Skeleton Scan</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '14px 32px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
          <span>💡 <strong>Tip for Demo:</strong> Click <em>Generate Concept Map</em> on any raw <strong>[AS IS]</strong> story to demonstrate direct AI architecture generation without template modification.</span>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
