import React from 'react';
import { ArrowDown } from 'lucide-react';

/**
 * Visual flow: Student Reasoning -> Computational Thinking Skill ->
 * Python Concept -> Generated Python Code, one flow per abstraction match
 * found for the scenario's sample reasoning.
 */
function CTMapping({ mapping }) {
  if (!mapping?.length) return null;

  return (
    <div className="ct-mapping">
      {mapping.map((step) => (
        <div className="ct-mapping-flow" key={step.step}>
          <div className="ct-mapping-node ct-mapping-reasoning">
            <span className="ct-mapping-label">Student Reasoning</span>
            <p>{step.studentReasoning}</p>
          </div>

          <ArrowDown size={18} className="ct-mapping-arrow" />

          <div className="ct-mapping-node ct-mapping-skill">
            <span className="ct-mapping-label">Computational Thinking Skill</span>
            <p>{step.computationalThinkingSkill}</p>
          </div>

          <ArrowDown size={18} className="ct-mapping-arrow" />

          <div className="ct-mapping-node ct-mapping-concept">
            <span className="ct-mapping-label">Python Concept</span>
            <p>{step.pythonConcept}</p>
          </div>

          {step.generatedCode && (
            <>
              <ArrowDown size={18} className="ct-mapping-arrow" />
              <div className="ct-mapping-node ct-mapping-code">
                <span className="ct-mapping-label">Generated Python Code</span>
                <pre>{step.generatedCode}</pre>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default CTMapping;
