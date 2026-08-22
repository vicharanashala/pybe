import React, { useState, useRef, useEffect } from "react";
import { HelpCircle, ExternalLink } from "lucide-react";

export default function HelpTooltip({ title, content, sectionId, onOpenManual }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <span className="help-tooltip-container" ref={containerRef}>
      <button
        type="button"
        className="help-tooltip-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Help for ${title}`}
        title={`What is ${title}? Click for quick info.`}
        aria-expanded={isOpen}
      >
        <HelpCircle size={15} />
      </button>

      {isOpen && (
        <div className="help-tooltip-popover" role="tooltip">
          <div className="help-tooltip-header">
            <strong>{title}</strong>
            <button
              type="button"
              className="help-tooltip-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close tooltip"
            >
              ×
            </button>
          </div>
          <p className="help-tooltip-content">{content}</p>
          {sectionId && onOpenManual && (
            <button
              type="button"
              className="help-tooltip-link"
              onClick={() => {
                setIsOpen(false);
                onOpenManual(sectionId);
              }}
            >
              <span>Read in Help Manual</span>
              <ExternalLink size={13} />
            </button>
          )}
        </div>
      )}
    </span>
  );
}
