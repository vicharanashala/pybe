export default function InheritanceTree() {
  return (
    <svg
      width="100%"
      height="200"
      viewBox="0 0 428 200"
      fontFamily="Nunito Sans, sans-serif"
    >
      {/* parent */}
      <rect x="174" y="6" width="80" height="34" rx="10" fill="#3A7D7C" />
      <text
        x="214"
        y="28"
        textAnchor="middle"
        fill="#fff"
        fontSize="13"
        fontWeight="700"
      >
        Bird
      </text>

      {/* connecting lines */}
      <line
        x1="214"
        y1="40"
        x2="214"
        y2="58"
        stroke="#c9c0a6"
        strokeWidth="2"
      />
      <line x1="40" y1="58" x2="388" y2="58" stroke="#c9c0a6" strokeWidth="2" />
      <line x1="40" y1="58" x2="40" y2="76" stroke="#c9c0a6" strokeWidth="2" />
      <line
        x1="127"
        y1="58"
        x2="127"
        y2="76"
        stroke="#c9c0a6"
        strokeWidth="2"
      />
      <line
        x1="214"
        y1="58"
        x2="214"
        y2="76"
        stroke="#c9c0a6"
        strokeWidth="2"
      />
      <line
        x1="301"
        y1="58"
        x2="301"
        y2="76"
        stroke="#c9c0a6"
        strokeWidth="2"
      />
      <line
        x1="388"
        y1="58"
        x2="388"
        y2="76"
        stroke="#c9c0a6"
        strokeWidth="2"
      />

      {/* children */}

      {[
        { x: 40, label: "Eagle", tag: "inherit", color: "#e8a33d" },
        { x: 127, label: "Penguin", tag: "override", color: "#c25b4a" },
        { x: 214, label: "Duck", tag: "extend", color: "#e8a33d" },
        { x: 301, label: "Sparrow", tag: "extend", color: "#e8a33d" },
        { x: 388, label: "Owl", tag: "override+super", color: "#2f6564" },
      ].map((c) => (
        <g key={c.label}>
          <rect
            x={c.x - 34}
            y="76"
            width="68"
            height="34"
            rx="10"
            fill="#fff"
            stroke={c.color}
            strokeWidth="2"
          />
          <text
            x={c.x}
            y="98"
            textAnchor="middle"
            fontSize="12.5"
            fontWeight="700"
            fill="#2b2b2b"
          >
            {c.label}
          </text>
          <text
            x={c.x}
            y="126"
            textAnchor="middle"
            fontSize="10"
            fill={c.color}
            fontWeight="700"
          >
            {c.tag}
          </text>
        </g>
      ))}

      <text x="214" y="160" textAnchor="middle" fontSize="11" fill="#5b5648">
        every child starts with all of Bird's eat(), sleep(), fly()
      </text>

      <text x="214" y="178" textAnchor="middle" fontSize="11" fill="#5b5648">
        — then each one does something different with what it inherited
      </text>
    </svg>
  );
}
