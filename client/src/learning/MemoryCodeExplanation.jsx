import React from "react";
import { ArrowRight } from "lucide-react";
// These studies already explain each selected line in the same ordered points.
// Share their controls and markup, while each keeps its own authored point data.
export default function MemoryCodeExplanation({
  selectedLine,
  step: explainStep,
  onStep: setExplainStep,
  onClose: setSelectedLine,
  isDanger,
  points,
  activePoint,
  code,
  showCategory = false,
  doneLabel = "Done ✓",
}) {
  return (
    <div
      key={`${selectedLine}-${explainStep}`}
      className="line-explain-card"
      data-line={selectedLine}
      style={{
        borderLeft: `4px solid ${activePoint.color}`,
        border: "1.5px solid #e4dcc8",
        background: "#ffffff",
        borderRadius: "14px",
        padding: "16px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
      }}
    >
      {showCategory && <p>{activePoint.category}</p>}
      {code && <pre className="memory-explanation-code">{code}</pre>}
      {/* Top Header & Step Navigation */}
      <div
        className="explain-top-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <div
          className="explain-step-pills"
          style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
        >
          {points.map((p) => {
            const isActive = explainStep === p.step;
            return (
              <button
                key={p.step}
                type="button"
                onClick={() => setExplainStep(p.step)}
                style={{
                  background: isActive ? p.bg : "#ffffff",
                  border: isActive
                    ? `1.5px solid ${p.color}`
                    : "1px solid #e4dcc8",
                  color: isActive ? p.color : "#7c7365",
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: "8px",
                  padding: "5px 12px",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {p.shortTag}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setSelectedLine(null)}
          type="button"
          style={{
            background: "#ffffff",
            border: "1px solid #e4dcc8",
            color: "#5b5648",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "999px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#2b2b2b";
            e.currentTarget.style.background = "#f4efe4";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#5b5648";
            e.currentTarget.style.background = "#ffffff";
          }}
        >
          ✕ Close
        </button>
      </div>

      {/* The 1 Active Focus Point Card */}
      <div
        className="single-point-hero"
        style={{
          background: "#fffdfa",
          border: "1px solid #e4dcc8",
          borderLeft: `3px solid ${activePoint.color}`,
          borderRadius: "12px",
          padding: "14px 16px",
        }}
      >
        <div
          className="single-point-body"
          style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}
        >
          <div
            className="single-point-icon-bubble"
            style={{
              background: "#f4efe4",
              border: "1px solid #e4dcc8",
              borderRadius: "10px",
              padding: "10px",
              fontSize: "1.25rem",
              lineHeight: 1,
            }}
          >
            {activePoint.icon}
          </div>
          <div className="single-point-content" style={{ flex: 1 }}>
            <span
              className="single-point-title"
              style={{
                color: activePoint.color,
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: "1rem",
                fontWeight: 800,
                display: "block",
                marginBottom: "4px",
              }}
            >
              {activePoint.label}
            </span>
            <p
              className="single-point-desc"
              style={{
                color: "#4a443b",
                fontSize: "0.88rem",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              {activePoint.text}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="explain-progress-bar"
        style={{
          background: "#f0ece0",
          height: "4px",
          borderRadius: "2px",
          margin: "14px 0 10px",
          overflow: "hidden",
        }}
      >
        <div
          className="explain-progress-fill"
          style={{
            width: `${(explainStep / points.length) * 100}%`,
            height: "100%",
            background: isDanger
              ? "linear-gradient(90deg, #FA994F, #e8a33d)"
              : "linear-gradient(90deg, #2f6564, #4f9a63)",
            transition: "width 0.25s ease",
          }}
        />
      </div>

      {/* Bottom Interactive Flow Bar */}
      <div
        className="explain-bottom-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setExplainStep((s) => Math.max(s - 1, 1))}
          disabled={explainStep === 1}
          type="button"
          className="explain-nav-btn prev"
          style={{
            background: "#ffffff",
            border: "1px solid #e4dcc8",
            color: explainStep === 1 ? "#b8b0a2" : "#5b5648",
            borderRadius: "999px",
            padding: "6px 14px",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: explainStep === 1 ? "not-allowed" : "pointer",
          }}
        >
          <span>← Prev</span>
        </button>

        <span
          style={{ fontSize: "0.78rem", color: "#7c7365", fontWeight: 600 }}
        >
          Point {explainStep} of {points.length}
        </span>

        {explainStep < points.length ? (
          <button
            onClick={() =>
              setExplainStep((s) => Math.min(s + 1, points.length))
            }
            type="button"
            className="explain-nav-btn next"
            style={{
              background: isDanger ? "#fff2e8" : "#e9f4ec",
              color: isDanger ? "#7c4a2d" : "#2f6564",
              border: isDanger ? "1px solid #FA994F" : "1px solid #4f9a63",
              borderRadius: "999px",
              padding: "6px 14px",
              fontSize: "0.8rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <span>Next Point</span>
            <span className="arrow-slide-anim" style={{ display: "flex" }}>
              <ArrowRight size={14} strokeWidth={2.8} />
            </span>
          </button>
        ) : (
          <button
            onClick={() => setSelectedLine(null)}
            type="button"
            className="explain-nav-btn next"
            style={{
              background: "#e9f4ec",
              color: "#256038",
              border: "1px solid #4f9a63",
              borderRadius: "999px",
              padding: "6px 14px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <span>{doneLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
