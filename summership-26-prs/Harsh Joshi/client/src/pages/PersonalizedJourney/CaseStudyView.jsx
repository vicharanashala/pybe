import React, { useState } from 'react';

export default function CaseStudyView({ caseStudy, onSuccess }) {
    const [userCode, setUserCode] = useState("");
    const [reflectionAnswer, setReflectionAnswer] = useState("");
    const [isSyntaxCorrect, setIsSyntaxCorrect] = useState(null);

    if (!caseStudy) return null;

    // Helper to split the application layer string and inject an interactive input field
    const renderInteractiveCode = (codeString) => {
        const parts = codeString.split(/_{2,}/); // Splits by multiple underscores
        
        if (parts.length === 1) {
            return <code>{codeString}</code>;
        }

        return (
            <code style={{ display: 'block', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                {parts[0]}
                <input 
                    type="text" 
                    value={userCode} 
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="type here..."
                    style={{ background: '#2d2d2d', color: '#00FF00', border: '1px solid #555', padding: '2px 5px', fontFamily: 'monospace', fontSize: '1rem', width: '120px' }}
                />
                {parts[1]}
            </code>
        );
    };

    const handleCheckSyntax = () => {
        // In a real app, this would evaluate against an AST or execution engine.
        // For our MVP, we simulate a logic check.
        if (userCode.trim().length > 0) {
            setIsSyntaxCorrect(true);
            if (onSuccess && caseStudy) {
                onSuccess(caseStudy.concept);
            }
        } else {
            setIsSyntaxCorrect(false);
        }
    };

    return (
        <div className="case-study-view" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'sans-serif' }}>
            
            {/* LAYER 1: STORY (Narrative Hook - Max 100 words) */}
            <div className="layer-story" style={{ background: '#FFF3E0', padding: '1.5rem', borderLeft: '5px solid #FF9800', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#E65100' }}>1. The Story</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{caseStudy.story_layer}</p>
            </div>

            {/* LAYER 2: DISCOVERY (Pseudo-code & Paradigm) */}
            <div className="layer-discovery" style={{ background: '#E3F2FD', padding: '1.5rem', borderLeft: '5px solid #2196F3', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0D47A1' }}>2. The Discovery (Paradigm mapping)</h3>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    {Object.entries(caseStudy.discovery_layer).map(([key, value]) => (
                        <li key={key}><strong>{key.replace('_', ' ').toUpperCase()}:</strong> {value}</li>
                    ))}
                </ul>
            </div>

            {/* LAYER 3: APPLICATION (Minimal Syntax - 95/5 Rule) */}
            <div className="layer-application" style={{ background: '#263238', padding: '1.5rem', borderLeft: '5px solid #4CAF50', borderRadius: '4px', color: '#ECEFF1' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#81C784' }}>3. The Application (The 5% Syntax)</h3>
                <div style={{ background: '#1E1E1E', padding: '1rem', borderRadius: '4px', overflowX: 'auto' }}>
                    {renderInteractiveCode(caseStudy.application_layer)}
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <button 
                        onClick={handleCheckSyntax}
                        style={{ padding: '0.5rem 1rem', background: '#4CAF50', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Verify Concept
                    </button>
                    {isSyntaxCorrect === true && <span style={{ marginLeft: '1rem', color: '#4CAF50', fontWeight: 'bold' }}>✓ Perfect! Concept Realized.</span>}
                    {isSyntaxCorrect === false && <span style={{ marginLeft: '1rem', color: '#F44336', fontWeight: 'bold' }}>✗ Keep trying. Think about the cause and effect.</span>}
                </div>
            </div>

            {/* LAYER 4: REFLECTION (Validation) */}
            <div className="layer-reflection" style={{ background: '#F3E5F5', padding: '1.5rem', borderLeft: '5px solid #9C27B0', borderRadius: '4px' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#4A148C' }}>4. The Reflection</h3>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{caseStudy.reflection_layer.question}</p>
                <textarea 
                    value={reflectionAnswer} 
                    onChange={(e) => setReflectionAnswer(e.target.value)}
                    placeholder="Your thoughts..."
                    style={{ width: '100%', height: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                />
            </div>

        </div>
    );
}
