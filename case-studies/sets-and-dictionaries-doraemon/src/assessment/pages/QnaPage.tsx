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

export interface QnaItem {
  id: string;
  category: 'basics' | 'operations' | 'performance';
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  codeSnippet?: string;
  keyTakeaway: string;
}

const SET_QNA_DATA: QnaItem[] = [
  {
    id: 'qna-1',
    category: 'basics',
    question: '1. What is a Set in Python and what are its key properties?',
    shortAnswer: 'A Set is an unordered collection of unique, immutable elements.',
    detailedAnswer: 'In Python, a Set is a built-in data structure that stores distinct values. Its two defining characteristics are:\n1. Uniqueness: Duplicate elements are automatically discarded upon insertion.\n2. Unordered: Elements have no fixed sequence or index. You cannot access elements using set[0].',
    codeSnippet: `# Creating a set with duplicates\nfruits = {"Apple", "Banana", "Apple", "Orange"}\nprint(fruits)  # Output: {'Banana', 'Apple', 'Orange'} (Duplicates removed!)\n\n# Ordering is not preserved\nprint(len(fruits))  # Output: 3`,
    keyTakeaway: 'Use a Set whenever you need to eliminate duplicates or care only about item existence without keeping order.'
  },
  {
    id: 'qna-2',
    category: 'basics',
    question: '2. How do you create an empty Set in Python, and why does {} not work?',
    shortAnswer: 'Use set() to create an empty set. {} creates an empty dictionary!',
    detailedAnswer: 'In Python, empty curly braces `{}` are reserved for initializing an empty dictionary (`dict`). If you check `type({})`, Python returns `<class "dict">`.\nTo instantiate an empty set, you MUST use the `set()` constructor.',
    codeSnippet: `# Incorrect empty set creation:\nempty_dict = {}  \nprint(type(empty_dict))  # <class 'dict'>\n\n# Correct empty set creation:\nempty_set = set()\nprint(type(empty_set))   # <class 'set'>\nempty_set.add("Bamboo Copter")`,
    keyTakeaway: 'Always use set() for an empty set. {} creates a dict.'
  },
  {
    id: 'qna-3',
    category: 'performance',
    question: '3. What types of items can be placed inside a Set?',
    shortAnswer: 'Only immutable (hashable) objects like numbers, strings, and tuples.',
    detailedAnswer: 'Sets rely on a Hash Table to maintain uniqueness and enable lightning-fast lookups. Therefore, every item in a set must be "hashable" (its hash value never changes during its lifetime).\n• Allowed: int, float, str, tuple, bool, frozenset\n• Forbidden: list, dict, set (raises TypeError: unhashable type)',
    codeSnippet: `# Allowed:\nvalid_set = {10, "Doraemon", (1, 2)}\n\n# Raises TypeError: unhashable type: 'list'\n# invalid_set = {10, [1, 2]}`,
    keyTakeaway: 'Elements inside a Set must be immutable (hashable).'
  },
  {
    id: 'qna-4',
    category: 'operations',
    question: '4. How do mathematical Set operations (Union, Intersection, Difference) work?',
    shortAnswer: 'Python sets support standard Venn diagram operations via operators or methods.',
    detailedAnswer: 'Set mathematical operations allow set comparison in a single line:\n• Union (|): Combines all unique items from both sets.\n• Intersection (&): Returns items present in BOTH sets.\n• Difference (-): Returns items in the first set but NOT in the second.\n• Symmetric Difference (^): Returns items present in either set, but NOT in both.',
    codeSnippet: `doraemon_gadgets = {"Anywhere Door", "Bamboo Copter", "Small Light"}\nnobita_wants = {"Bamboo Copter", "Memory Bread"}\n\n# Union (|)\nall_gadgets = doraemon_gadgets | nobita_wants\n# {'Anywhere Door', 'Bamboo Copter', 'Small Light', 'Memory Bread'}\n\n# Intersection (&)\ncommon = doraemon_gadgets & nobita_wants\n# {'Bamboo Copter'}\n\n# Difference (-)\nonly_doraemon = doraemon_gadgets - nobita_wants\n# {'Anywhere Door', 'Small Light'}`,
    keyTakeaway: 'Set algebra (|, &, -, ^) avoids writing nested for-loops when comparing collections.'
  },
  {
    id: 'qna-5',
    category: 'performance',
    question: '5. What is the time complexity of checking "x in my_set"?',
    shortAnswer: 'O(1) average time complexity (constant time).',
    detailedAnswer: 'Checking membership `x in my_list` takes O(N) time because Python must inspect elements one by one. In contrast, `x in my_set` takes O(1) average time because Python hashes the key directly to its table location — making lookups practically instantaneous regardless of whether the set has 10 items or 10,000,000 items!',
    codeSnippet: `items_list = list(range(1000000))\nitems_set = set(range(1000000))\n\n# Lookup in list: O(N) — slow for large N\nprint(999999 in items_list)  # Scans up to 1,000,000 items\n\n# Lookup in set: O(1) — instant!\nprint(999999 in items_set)   # Directly calculates hash`,
    keyTakeaway: 'Checking membership (x in S) in a Set is O(1) instant lookup.'
  },
  {
    id: 'qna-6',
    category: 'operations',
    question: '6. What is the difference between .remove() and .discard()?',
    shortAnswer: '.remove() raises KeyError if missing; .discard() fails silently.',
    detailedAnswer: 'When deleting an item from a set:\n• `.remove(element)`: Removes the item. If the item does not exist, it throws a `KeyError` crash.\n• `.discard(element)`: Removes the item if present. If missing, it safely ignores it without raising an error.',
    codeSnippet: `s = {"Anywhere Door", "Bamboo Copter"}\n\ns.discard("Small Light")  # Safe! No error raised.\n\n# s.remove("Small Light")  # Raises KeyError: 'Small Light'`,
    keyTakeaway: 'Use .discard() when you are unsure if an item exists and want to prevent crashes.'
  }
];

interface QnaPageProps {
  onProceedToTest?: () => void;
}

export const QnaPage: React.FC<QnaPageProps> = ({ onProceedToTest }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'basics' | 'operations' | 'performance'>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['qna-1', 'qna-2']));
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

  const filteredQna = SET_QNA_DATA.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  const understoodCount = understoodIds.size;
  const totalCount = SET_QNA_DATA.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }} className="animate-fade-in">
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={18} style={{ color: '#8b5cf6' }} />
          <span style={{ fontSize: '12px', fontWeight: 900, color: '#8b5cf6', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            TECHNICAL Q&A STAGE
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Badge variant="primary">
            {understoodCount}/{totalCount} Mastered
          </Badge>
        </div>
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
              Doraemon's Set Technical Companion
            </h2>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
              Review these essential technical questions about Python Sets before taking the quiz test challenge. Tap any question to reveal code snippets and detailed breakdowns.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Questions', icon: BookOpen },
          { id: 'basics', label: 'Basics & Syntax', icon: Code2 },
          { id: 'operations', label: 'Set Operations', icon: Sparkles },
          { id: 'performance', label: 'O(1) & Rules', icon: Zap }
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

      {/* Q&A Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredQna.map((item) => {
          const isExpanded = expandedIds.has(item.id);
          const isUnderstood = understoodIds.has(item.id);

          return (
            <GlassCard
              key={item.id}
              style={{
                padding: '0',
                overflow: 'hidden',
                background: 'white',
                border: isUnderstood 
                  ? '1.5px solid rgba(34, 197, 94, 0.35)' 
                  : isExpanded 
                    ? '1.5px solid rgba(139, 92, 246, 0.3)' 
                    : '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: isExpanded ? '0 8px 24px rgba(139, 92, 246, 0.06)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Question Header */}
              <div
                onClick={() => toggleExpand(item.id)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(139, 92, 246, 0.02)' : 'white',
                  borderBottom: isExpanded ? '1px solid rgba(0, 0, 0, 0.06)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  {/* Expand Chevron */}
                  <div style={{ color: '#8b5cf6', flexShrink: 0 }}>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', lineHeight: 1.4 }}>
                      {item.question}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                      {item.shortAnswer}
                    </div>
                  </div>
                </div>

                {/* Mark as Understood Button */}
                <button
                  onClick={(e) => toggleUnderstood(item.id, e)}
                  title={isUnderstood ? 'Marked as understood' : 'Click to mark as understood'}
                  style={{
                    padding: '6px 12px', borderRadius: '8px',
                    border: isUnderstood ? '1px solid #22c55e' : '1px solid rgba(0,0,0,0.1)',
                    background: isUnderstood ? 'rgba(34, 197, 94, 0.1)' : 'white',
                    color: isUnderstood ? '#15803d' : '#64748b',
                    fontSize: '11px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '4px',
                    cursor: 'pointer', flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <CheckCircle2 size={13} style={{ color: isUnderstood ? '#22c55e' : '#cbd5e1' }} />
                  {isUnderstood ? 'Mastered' : 'Mark Learned'}
                </button>
              </div>

              {/* Detailed Body when expanded */}
              {isExpanded && (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }} className="animate-fade-in">
                  
                  {/* Detailed explanation text */}
                  <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {item.detailedAnswer}
                  </div>

                  {/* Code snippet block if available */}
                  {item.codeSnippet && (
                    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0, 140, 255, 0.2)' }}>
                      <div style={{ padding: '6px 12px', background: '#0f172a', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
                        <Terminal size={12} />
                        <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.5px' }}>PYTHON CODE EXAMPLE</span>
                      </div>
                      <pre style={{
                        margin: 0, padding: '14px 16px',
                        background: '#091124', color: '#f1f5f9',
                        fontFamily: 'var(--font-mono)', fontSize: '12px',
                        lineHeight: 1.6, overflowX: 'auto'
                      }}>
                        <code>{item.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Key Takeaway box */}
                  <div style={{
                    padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255, 196, 0, 0.08)',
                    border: '1px solid rgba(255, 196, 0, 0.25)',
                    fontSize: '12px', color: '#92400e', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
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
            Ready for the Knowledge Test?
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            {understoodCount === totalCount ? '🎉 You have mastered all 6 Q&A topics!' : `You reviewed ${understoodCount} of ${totalCount} topics.`}
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
            border: 'none', color: 'white', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)'
          }}
        >
          <span>Proceed to Test</span>
          <ArrowRight size={16} />
        </button>
      </GlassCard>

    </div>
  );
};

export default QnaPage;
