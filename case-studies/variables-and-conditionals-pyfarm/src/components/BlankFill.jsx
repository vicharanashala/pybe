import React from 'react';
import { assembleBlanks, filledCount, isComplete, templateLines } from '../engine/blanks';

// Fill-in-the-blanks view of the code challenge: the program's shape is given,
// and the learner chooses what goes in each gap.
//
// The pickers are real radio inputs inside a fieldset, so a keyboard user gets
// arrow-key movement between options and a labelled group for free — which a
// row of buttons would not give them.

function SlotChip({ slot, value, index }) {
  return (
    <span className={`pf-slot${value ? ' is-filled' : ''}`}>
      {value || (
        <>
          <span className="pf-slot-num" aria-hidden="true">{index + 1}</span>
          <span className="pf-slot-empty">choose below</span>
        </>
      )}
    </span>
  );
}

export default function BlankFill({ blanks, selections, onSelect, disabled }) {
  const { template, slots } = blanks;
  const lines = templateLines(template);
  const filled = filledCount(template, selections);
  const complete = isComplete(template, selections);
  const slotIndex = (id) => slots.findIndex((s) => s.id === id);

  return (
    <div className="pf-blanks">
      <div className="pf-editor-wrap">
        <div className="pf-editor-bar">
          <span className="pf-editor-file">farm.py</span>
          <span className="pf-editor-tip">
            {complete ? 'All blanks chosen — run it' : `${filled} of ${slots.length} blanks chosen`}
          </span>
        </div>

        {/* The assembled program, with each gap shown in place. */}
        <pre className="pf-code pf-code-template">
          <code>
            {lines.map((parts, i) => (
              <span className="pf-code-line" key={i}>
                {parts.length === 0 ? ' ' : null}
                {parts.map((part, j) =>
                  part.type === 'text' ? (
                    <span key={j} className={part.value.trim().startsWith('#') ? 'pf-tok-com' : undefined}>
                      {part.value}
                    </span>
                  ) : (
                    <SlotChip
                      key={j}
                      slot={part.id}
                      value={selections[part.id]}
                      index={slotIndex(part.id)}
                    />
                  )
                )}
                {i < lines.length - 1 ? '\n' : ''}
              </span>
            ))}
          </code>
        </pre>
      </div>

      <div className="pf-slot-pickers">
        {slots.map((slot, index) => (
          <fieldset className="pf-slot-picker" key={slot.id} disabled={disabled}>
            <legend>
              <span className="pf-slot-num" aria-hidden="true">{index + 1}</span>
              {slot.label}
            </legend>
            {slot.help && <p className="pf-slot-help">{slot.help}</p>}

            <div className="pf-slot-options">
              {slot.options.map((option) => (
                <label
                  key={option}
                  className={`pf-slot-option${selections[slot.id] === option ? ' is-chosen' : ''}`}
                >
                  <input
                    type="radio"
                    name={`pf-slot-${slot.id}`}
                    value={option}
                    checked={selections[slot.id] === option}
                    onChange={() => onSelect(slot.id, option)}
                  />
                  <code>{option}</code>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {complete && (
        <details className="pf-output pf-assembled">
          <summary>The Python this builds</summary>
          <pre>{assembleBlanks(template, selections).trim()}</pre>
        </details>
      )}
    </div>
  );
}
