import React, { useState } from 'react';

/**
 * Utility to convert CSS style string into React style object
 */
function parseStyleString(styleStr) {
  if (!styleStr) return {};
  const styles = {};
  styleStr.split(';').forEach(pair => {
    const colonIdx = pair.indexOf(':');
    if (colonIdx !== -1) {
      const key = pair.slice(0, colonIdx).trim();
      const val = pair.slice(colonIdx + 1).trim();
      if (key && val) {
        const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styles[camelKey] = val;
      }
    }
  });
  return styles;
}

/**
 * Stateful MCQ Block Component with optional gated explanation & wrong answer feedback
 */
function McqBlock({ node, onAnswerCorrect }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  try {
    const childrenArray = Array.from(node.children || []);
    
    // Find <z-question>
    const questionNode = childrenArray.find(
      n => n.tagName && n.tagName.toLowerCase() === 'z-question'
    );
    
    // Find <z-options> wrapper if present
    const optionsWrapper = childrenArray.find(
      n => n.tagName && n.tagName.toLowerCase() === 'z-options'
    );
    
    // Find <z-explanation>
    const explanationNode = childrenArray.find(
      n => n.tagName && n.tagName.toLowerCase() === 'z-explanation'
    );

    // Extract options either from <z-options> wrapper or directly under <z-mcq>
    let optionNodes = [];
    if (optionsWrapper) {
      optionNodes = Array.from(optionsWrapper.children || []).filter(
        n => n.tagName && n.tagName.toLowerCase() === 'z-option'
      );
    } else {
      optionNodes = childrenArray.filter(
        n => n.tagName && n.tagName.toLowerCase() === 'z-option'
      );
    }

    const handleOptionClick = (idx, isCorrect) => {
      setSelectedIdx(idx);
      if (isCorrect) {
        setIsSolved(true);
        if (onAnswerCorrect) {
          onAnswerCorrect(); // Fires immediately to enable next button!
        }
      }
    };

    const isWrongSelected = selectedIdx !== null && optionNodes[selectedIdx]?.getAttribute('correct') !== 'true';
    const isCorrectSelected = selectedIdx !== null && optionNodes[selectedIdx]?.getAttribute('correct') === 'true';

    return (
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700 w-full my-4 block">
        {questionNode && (
          <div className="text-lg font-medium text-slate-100 mb-4 block">
            {renderDomNodes(questionNode.childNodes, { insideMcq: true })}
          </div>
        )}

        <div className="flex flex-col gap-3 mt-4">
          {optionNodes.map((opt, idx) => {
            const isCorrect = opt.getAttribute('correct') === 'true';
            const isSelected = selectedIdx === idx;

            let btnClasses = "w-full text-left p-4 rounded-md border transition-colors cursor-pointer text-lg ";
            if (isSelected) {
              if (isCorrect) {
                btnClasses += "bg-green-900/50 border-green-500 text-green-200 font-medium";
              } else {
                btnClasses += "bg-red-900/50 border-red-500 text-red-200 font-medium";
              }
            } else {
              btnClasses += "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx, isCorrect)}
                className={btnClasses}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSelected && isCorrect 
                      ? "bg-green-500 text-white" 
                      : isSelected && !isCorrect 
                      ? "bg-red-500 text-white" 
                      : "bg-slate-600 text-slate-300"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-lg">{renderDomNodes(opt.childNodes, { insideMcq: true })}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 1. Wrong Answer Feedback */}
        {isWrongSelected && (
          <p className="text-red-400 text-sm font-medium mt-3 animate-pulse">
            Incorrect, please try again.
          </p>
        )}

        {/* 2. Gated & Optional Explanation when correct option is clicked */}
        {isCorrectSelected && explanationNode && (
          <div className="mt-4">
            {!isExplanationVisible ? (
              <button
                onClick={() => setIsExplanationVisible(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md mt-4 text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-2 shadow-md"
              >
                Show Explanation
              </button>
            ) : (
              /* 3. Differentiated Explanation Formatting */
              <div className="mt-4 p-4 bg-slate-900 border-l-4 border-blue-500 rounded-r-md text-slate-300 italic text-base leading-relaxed shadow-inner animate-fade-in block">
                {renderDomNodes(explanationNode.childNodes, { insideMcq: true })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  } catch (err) {
    return (
      <div className="p-4 bg-red-900/40 border border-red-500 rounded-md text-red-200 text-sm my-4">
        Failed to render MCQ question block: {err.message}
      </div>
    );
  }
}

/**
 * Recursive DOM to React element converter mapping standard tags and <z-*> pseudo-tags.
 */
function renderDomNode(node, index, context = {}) {
  if (!node) return null;

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    return text;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const tagName = node.tagName.toLowerCase();

  // Custom <z-*> tags
  if (tagName === 'z-announcement') {
    return (
      <div key={index} className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-md text-yellow-200 italic shadow-md my-4 block text-lg">
        {renderDomNodes(node.childNodes, context)}
      </div>
    );
  }

  if (tagName === 'z-question') {
    if (context.insideMcq) {
      return (
        <div key={index} className="text-lg font-medium text-slate-100 mb-4 block">
          {renderDomNodes(node.childNodes, context)}
        </div>
      );
    }
    return (
      <div key={index} className="text-xl font-semibold text-blue-400 my-2 block">
        {renderDomNodes(node.childNodes, context)}
      </div>
    );
  }

  if (tagName === 'z-reply') {
    return (
      <div key={index} className="bg-slate-800 text-slate-100 p-3 rounded-lg block mt-3 w-fit shadow-md border border-slate-700 my-2 text-lg">
        {renderDomNodes(node.childNodes, context)}
      </div>
    );
  }

  if (tagName === 'z-mcq') {
    return (
      <McqBlock 
        key={index} 
        node={node} 
        onAnswerCorrect={context.onAnswerCorrect} 
      />
    );
  }

  // Standard HTML tags mapped to Design System specs
  if (tagName === 'div') {
    const styleAttr = node.getAttribute('style') || '';
    const inlineStyles = parseStyleString(styleAttr);

    let extraClasses = "";
    if (styleAttr.includes('text-align: center') || styleAttr.includes('text-align:center') || inlineStyles.textAlign === 'center') {
      extraClasses += " text-center";
    }
    if (styleAttr.includes('margin-top: auto') || styleAttr.includes('margin-bottom: auto')) {
      extraClasses += " my-auto flex-1 flex flex-col justify-center items-center min-h-[50vh]";
    }

    return (
      <div
        key={index}
        style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
        className={`my-1 text-lg text-slate-200 leading-relaxed${extraClasses}`}
      >
        {renderDomNodes(node.childNodes, context)}
      </div>
    );
  }

  if (tagName === 'h3') {
    return (
      <h3 key={index} className="text-2xl font-bold text-blue-400 mb-4">
        {renderDomNodes(node.childNodes, context)}
      </h3>
    );
  }

  if (tagName === 'h4') {
    return (
      <h4 key={index} className="text-xl font-semibold text-slate-100 mb-3">
        {renderDomNodes(node.childNodes, context)}
      </h4>
    );
  }

  if (tagName === 'ul') {
    return (
      <ul key={index} className="list-disc pl-6 space-y-2 text-slate-200 text-lg my-3">
        {renderDomNodes(node.childNodes, context)}
      </ul>
    );
  }

  if (tagName === 'ol') {
    return (
      <ol key={index} className="list-decimal pl-6 space-y-2 text-slate-200 text-lg my-3">
        {renderDomNodes(node.childNodes, context)}
      </ol>
    );
  }

  if (tagName === 'li') {
    return (
      <li key={index} className="text-slate-200 text-lg">
        {renderDomNodes(node.childNodes, context)}
      </li>
    );
  }

  if (tagName === 'pre') {
    return (
      <pre key={index} className="bg-[#1e1e1e] text-slate-300 p-4 rounded-md font-mono text-sm overflow-x-auto border border-slate-700 my-4">
        {renderDomNodes(node.childNodes, context)}
      </pre>
    );
  }

  if (tagName === 'code') {
    const parentTag = node.parentNode?.tagName?.toLowerCase();
    if (parentTag === 'pre') {
      return <code key={index} className="font-mono text-slate-300">{node.textContent}</code>;
    }
    return (
      <code key={index} className="bg-[#1e1e1e] text-blue-300 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-700">
        {node.textContent}
      </code>
    );
  }

  if (tagName === 'p') {
    return (
      <p key={index} className="text-lg text-slate-200 mb-4 leading-relaxed">
        {renderDomNodes(node.childNodes, context)}
      </p>
    );
  }

  if (tagName === 'b' || tagName === 'strong') {
    return (
      <strong key={index} className="font-bold text-slate-100">
        {renderDomNodes(node.childNodes, context)}
      </strong>
    );
  }

  if (tagName === 'i' || tagName === 'em') {
    return (
      <em key={index} className="italic text-slate-200">
        {renderDomNodes(node.childNodes, context)}
      </em>
    );
  }

  if (tagName === 'br') {
    return <br key={index} />;
  }

  // Fallback for container elements
  return (
    <div key={index} className="my-1 text-lg text-slate-200 leading-relaxed">
      {renderDomNodes(node.childNodes, context)}
    </div>
  );
}

function renderDomNodes(childNodes, context = {}) {
  if (!childNodes || childNodes.length === 0) return null;
  return Array.from(childNodes).map((child, index) => renderDomNode(child, index, context));
}

export default function ContentRenderer({ htmlString, onAnswerCorrect }) {
  if (!htmlString) return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');

    return (
      <div className="content-renderer leading-relaxed text-slate-200 text-lg space-y-2 flex-1 flex flex-col">
        {renderDomNodes(doc.body.childNodes, { onAnswerCorrect })}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 bg-red-950/80 border border-red-500 rounded-lg text-red-200 my-4 text-base">
        <h4 className="font-bold text-red-100 mb-1">Content Rendering Error</h4>
        <p>{error?.message || 'Failed to render beat content.'}</p>
      </div>
    );
  }
}
