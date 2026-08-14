import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Badge } from '../../shared-components/Badge';
import { 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Code2, 
  ArrowRight,
  BookOpen,
  Zap,
  Terminal
} from 'lucide-react';
import type { QnaItem } from './QnaPage';

const DICT_QNA_DATA: QnaItem[] = [
  {
    id: 'dict-qna-1',
    category: 'basics',
    question: '1. What is a Dictionary in Python and how is it defined?',
    shortAnswer: 'A Dictionary is an unordered/insertion-ordered collection of key:value pairs.',
    detailedAnswer: 'In Python, a Dictionary (`dict`) stores data in `{key: value}` associations. Unlike lists which use 0-based numeric indices, a dictionary lets you access values using descriptive Keys (like strings or numbers).\n1. Key: Unique identifier used for lookup.\n2. Value: Data linked to that Key (can be any type: int, list, string, etc.).',
    codeSnippet: `# Creating a dictionary\npocket = {\n    "Door": "Dial destination",\n    "Copter": "Attach to head",\n    "Light": "Press yellow button"\n}\n\n# Accessing value by Key:\nprint(pocket["Copter"])  # Output: "Attach to head"`,
    keyTakeaway: 'Use a Dictionary whenever data has a natural identifier (e.g. username -> email, gadget -> instruction).'
  },
  {
    id: 'dict-qna-2',
    category: 'basics',
    question: '2. What happens if you try to access a Key that does NOT exist in a dictionary?',
    shortAnswer: 'dict[missing_key] throws a KeyError. Use .get() for safe lookups!',
    detailedAnswer: 'Direct bracket access `my_dict["missing_key"]` immediately raises a `KeyError` crash.\nTo perform safe lookups without crashing, use `my_dict.get("missing_key", default_val)`, which returns `None` (or your custom default value) if the key is absent.',
    codeSnippet: `pocket = {"Door": "Dial destination"}\n\n# Direct access throws KeyError:\n# print(pocket["Copter"])  # KeyError: 'Copter'\n\n# Safe access with .get():\nprint(pocket.get("Copter"))            # Output: None\nprint(pocket.get("Copter", "Not Found")) # Output: "Not Found"`,
    keyTakeaway: 'Use dict.get(key, default) to prevent KeyError crashes when looking up unknown keys.'
  },
  {
    id: 'dict-qna-3',
    category: 'performance',
    question: '3. Are Keys in a Dictionary allowed to be mutable (like Lists)?',
    shortAnswer: 'No! Keys MUST be immutable (hashable). Values can be anything.',
    detailedAnswer: 'Because Dictionaries use Hash Tables for $O(1)$ lookup speeds, Keys must have an unchanging hash value.\n• Allowed Keys: str, int, float, tuple, bool\n• Forbidden Keys: list, dict, set (raises TypeError: unhashable type)\nValues have NO restrictions — they can be lists, dicts, or functions!',
    codeSnippet: `# Allowed:\nvalid_dict = {("x", "y"): 100, 42: "Answer", "name": "Nobita"}\n\n# Invalid Key (List as key):\n# invalid_dict = {[1, 2]: "Invalid"}  # TypeError: unhashable type: 'list'`,
    keyTakeaway: 'Dictionary Keys MUST be immutable (hashable). Values can be any data type.'
  },
  {
    id: 'dict-qna-4',
    category: 'operations',
    question: '4. How do you iterate through Keys, Values, and Items of a dictionary?',
    shortAnswer: 'Use .keys(), .values(), and .items() in for-loops.',
    detailedAnswer: 'Python provides three dictionary iteration methods:\n• `.keys()`: Yields only keys.\n• `.values()`: Yields only values.\n• `.items()`: Yields `(key, value)` tuples.',
    codeSnippet: `scores = {"Math": 0, "English": 25}\n\n# Iterating key-value pairs using .items():\nfor subject, mark in scores.items():\n    print(f"{subject}: {mark}")\n# Output:\n# Math: 0\n# English: 25`,
    keyTakeaway: 'Use for key, value in dict.items() to loop over keys and values simultaneously.'
  },
  {
    id: 'dict-qna-5',
    category: 'performance',
    question: '5. What is the Time Complexity of dict[key] lookup?',
    shortAnswer: 'O(1) average time complexity (instant lookup).',
    detailedAnswer: 'Looking up `my_dict[key]` takes $O(1)$ average time complexity because Dictionaries use a Hash Table under the hood. Python computes `hash(key)` to jump directly to the memory address of the value — making lookups instant regardless of dictionary size!',
    codeSnippet: `big_dict = {i: i*2 for i in range(1000000)}\n\n# Instant O(1) lookup:\nprint(big_dict[999999])  # 1999998 (Calculates hash directly)`,
    keyTakeaway: 'Dictionary key lookup is O(1) constant time regardless of size.'
  }
];

interface DictQnaPageProps {
  onProceedToTest?: () => void;
}

export const DictQnaPage: React.FC<DictQnaPageProps> = ({ onProceedToTest }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'basics' | 'operations' | 'performance'>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['dict-qna-1', 'dict-qna-2']));
  const [understoodIds, setUnderstoodIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleUnderstood = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUnderstoodIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredQna = DICT_QNA_DATA.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  const understoodCount = understoodIds.size;
  const totalCount = DICT_QNA_DATA.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }} className="animate-fade-in">
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={18} style={{ color: '#8b5cf6' }} />
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#8b5cf6', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            DICTIONARIES TECHNICAL Q&A STAGE
          </span>
        </div>
        
        <Badge variant="primary">
          {understoodCount}/{totalCount} Mastered
        </Badge>
      </div>

      {/* Intro Card */}
      <GlassCard style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)', border: '1.5px solid rgba(139, 92, 246, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', color: 'white', flexShrink: 0,
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)'
          }}>
            🤖
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
              Doraemon's Dictionary Technical Companion
            </h2>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
              Review these core questions about Python Dictionaries (`dict`), key immutability, `.get()`, and `.items()` loops before proceeding to the test!
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Questions', icon: BookOpen },
          { id: 'basics', label: 'Basics & .get()', icon: Code2 },
          { id: 'operations', label: '.items() & Methods', icon: Sparkles },
          { id: 'performance', label: 'O(1) & Key Rules', icon: Zap }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '10px',
                border: isActive ? '1.5px solid #8b5cf6' : '1px solid rgba(0, 0, 0, 0.08)',
                background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'white',
                color: isActive ? '#6d28d9' : '#64748b',
                fontWeight: isActive ? 800 : 600,
                fontSize: '12px', cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Q&A List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredQna.map((item) => {
          const isExpanded = expandedIds.has(item.id);
          const isUnderstood = understoodIds.has(item.id);

          return (
            <GlassCard
              key={item.id}
              style={{
                padding: '0', overflow: 'hidden', background: 'white',
                border: isUnderstood 
                  ? '1.5px solid rgba(34, 197, 94, 0.35)' 
                  : isExpanded 
                    ? '1.5px solid rgba(139, 92, 246, 0.3)' 
                    : '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <div
                onClick={() => toggleExpand(item.id)}
                style={{
                  padding: '16px 20px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '12px', cursor: 'pointer',
                  background: isExpanded ? 'rgba(139, 92, 246, 0.02)' : 'white',
                  borderBottom: isExpanded ? '1px solid rgba(0, 0, 0, 0.06)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{ color: '#8b5cf6', flexShrink: 0 }}>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>
                      {item.question}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                      {item.shortAnswer}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => toggleUnderstood(item.id, e)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px',
                    border: isUnderstood ? '1px solid #22c55e' : '1px solid rgba(0,0,0,0.1)',
                    background: isUnderstood ? 'rgba(34, 197, 94, 0.1)' : 'white',
                    color: isUnderstood ? '#15803d' : '#64748b',
                    fontSize: '11px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer'
                  }}
                >
                  <CheckCircle2 size={13} style={{ color: isUnderstood ? '#22c55e' : '#cbd5e1' }} />
                  {isUnderstood ? 'Mastered' : 'Mark Learned'}
                </button>
              </div>

              {isExpanded && (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
                  <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {item.detailedAnswer}
                  </div>

                  {item.codeSnippet && (
                    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0, 140, 255, 0.2)' }}>
                      <div style={{ padding: '6px 12px', background: '#0f172a', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
                        <Terminal size={12} />
                        <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>PYTHON CODE EXAMPLE</span>
                      </div>
                      <pre style={{ margin: 0, padding: '14px 16px', background: '#091124', color: '#f1f5f9', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6, overflowX: 'auto' }}>
                        <code>{item.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 196, 0, 0.08)', border: '1px solid rgba(255, 196, 0, 0.25)', fontSize: '12px', color: '#92400e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💡</span>
                    <span><strong>Key Takeaway:</strong> {item.keyTakeaway}</span>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Footer Navigation Button to proceed to Test */}
      <GlassCard style={{ padding: '20px 24px', background: 'white', border: '1.5px solid rgba(139, 92, 246, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
            Ready for the Dictionaries Knowledge Test?
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {understoodCount === totalCount ? '🎉 You have mastered all 5 Dictionary topics!' : `You reviewed ${understoodCount} of ${totalCount} topics.`}
          </div>
        </div>

        <button
          onClick={onProceedToTest}
          className="btn btn-primary"
          style={{
            padding: '10px 20px', borderRadius: '10px',
            fontSize: '13px', fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            border: 'none', color: 'white'
          }}
        >
          <span>Proceed to Test</span>
          <ArrowRight size={16} />
        </button>
      </GlassCard>

    </div>
  );
};

export default DictQnaPage;
