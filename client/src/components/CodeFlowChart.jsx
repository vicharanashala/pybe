import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { parsePythonLogic, buildASTFlow } from '../utils/parser';

function FlowNodesList({ nodes, hoveredLine, onHoverLine }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="flow-arrow-direct">
        <svg width="16" height="24" viewBox="0 0 16 24">
          <line x1="8" y1="0" x2="8" y2="18" stroke="#4a5c55" strokeWidth="2" strokeDasharray="3,3" />
          <polygon points="8,24 4,16 12,16" fill="#4a5c55" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flow-nodes-list">
      {nodes.map((node, index) => {
        const isLast = index === nodes.length - 1;

        if (node.type === 'conditional_group') {
          const isActive = hoveredLine === node.lineNo;
          return (
            <div key={node.id} className="flow-conditional-group">
              {/* Diamond Condition Box */}
              <div className="flow-diamond-container">
                <div
                  className={`flow-card type-branch diamond-shape ${isActive ? 'flow-card-active' : ''}`}
                  onMouseEnter={() => node.lineNo ? onHoverLine(node.lineNo) : null}
                  onMouseLeave={() => node.lineNo ? onHoverLine(null) : null}
                >
                  <span className="flow-card-text">❓ Is {node.condition}?</span>
                </div>
              </div>

              {/* Yes/No side by side branches */}
              <div className="flow-branches-container">
                <div className="flow-branch-column branch-true">
                  <span className="branch-label label-yes">Yes</span>
                  <FlowNodesList nodes={node.thenBranch} hoveredLine={hoveredLine} onHoverLine={onHoverLine} />
                </div>
                <div className="flow-branch-column branch-false">
                  <span className="branch-label label-no">No</span>
                  <FlowNodesList nodes={node.elseBranch} hoveredLine={hoveredLine} onHoverLine={onHoverLine} />
                </div>
              </div>

              {/* Merge down indicator if not the last block */}
              {!isLast && (
                <div className="flow-arrow">
                  <svg width="16" height="24" viewBox="0 0 16 24">
                    <line x1="8" y1="0" x2="8" y2="18" stroke="#4a5c55" strokeWidth="2" />
                    <polygon points="8,24 4,16 12,16" fill="#4a5c55" />
                  </svg>
                </div>
              )}
            </div>
          );
        }

        // Regular statement node
        const isActive = hoveredLine === node.lineNo;
        return (
          <div key={node.id} className="flow-node-row" style={{ paddingLeft: `${(node.indent || 0) * 12}px` }}>
            <div
              className={`flow-card type-${node.type} ${isActive ? 'flow-card-active' : ''}`}
              onMouseEnter={() => node.lineNo ? onHoverLine(node.lineNo) : null}
              onMouseLeave={() => node.lineNo ? onHoverLine(null) : null}
            >
              <span className="flow-card-text">{node.label}</span>
            </div>
            {!isLast && (
              <div className="flow-arrow">
                <svg width="16" height="24" viewBox="0 0 16 24">
                  <line x1="8" y1="0" x2="8" y2="18" stroke="#4a5c55" strokeWidth="2" />
                  <polygon points="8,24 4,16 12,16" fill="#4a5c55" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CodeFlowChart({ code, style, hoveredLine, onHoverLine }) {
  const nestedNodes = useMemo(() => {
    const flat = parsePythonLogic(code);
    return buildASTFlow(flat);
  }, [code]);

  return (
    <div className="flowchart-panel" style={style}>
      <div className="flowchart-header">
        <Sparkles size={16} className="icon-gold" />
        <span>Live Flowchart Visualizer</span>
      </div>
      <div className="flowchart-body">
        <FlowNodesList nodes={nestedNodes} hoveredLine={hoveredLine} onHoverLine={onHoverLine} />
      </div>
    </div>
  );
}
