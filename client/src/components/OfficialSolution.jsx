import React from 'react';
import CodeViewer from './CodeViewer';
import InputOutputSection from './InputOutputSection';

/**
 * The official generated code, code explanation, and worked input/output
 * example for a scenario. Split out of ScenarioDetails so the guided flow
 * can withhold it until the learner reveals it.
 *
 * Note: the code here is still built using computational thinking under
 * the hood (see services/scenarioEnrichment.js + learningEngine.js, which
 * map the scenario's reasoning to a CT pattern and Python concept before
 * generating this code) - that mapping just isn't rendered as its own
 * visual section anymore, since the code and explanation below already
 * reflect it directly.
 */
function OfficialSolution({ scenario }) {
  return (
    <>
      <section className="panel">
        <div className="section-title"><h2>Generated Python code</h2></div>
        <CodeViewer code={scenario.generatedCode} />

        <h3 className="code-explanation-title">Code explanation</h3>
        <p className="section-subtitle">{scenario.codeExplanationSummary}</p>
        <ol className="code-explanation-list">
          {scenario.codeExplanation?.map((entry, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index}>
              <code>{entry.line.trim() || '(blank line)'}</code>
              <p>{entry.explanation}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel">
        <div className="section-title"><h2>Example input &amp; output</h2></div>
        <InputOutputSection example={scenario.example} />
      </section>
    </>
  );
}

export default OfficialSolution;
