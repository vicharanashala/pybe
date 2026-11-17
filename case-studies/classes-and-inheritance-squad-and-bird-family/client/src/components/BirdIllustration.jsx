export function BirdParent({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="72" rx="34" ry="26" fill="#3A7D7C" />
      <circle cx="60" cy="40" r="20" fill="#3A7D7C" />
      <path d="M60 40 L82 44 L60 48 Z" fill="#E8A33D" />
      <circle cx="66" cy="36" r="3.2" fill="#FAF6EE" />
      <path d="M34 66 Q10 60 18 84 Q30 84 40 74Z" fill="#2F6564" />
      <path d="M86 66 Q110 60 102 84 Q90 84 80 74Z" fill="#2F6564" />
      <path d="M50 96 L54 106 M60 98 L60 108 M70 96 L66 106" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function EagleChild({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="72" rx="34" ry="26" fill="#8C5A2B" />
      <circle cx="60" cy="40" r="20" fill="#5C3B1E" />
      <path d="M60 40 L84 44 L60 49 Z" fill="#E8A33D" />
      <circle cx="67" cy="36" r="3.2" fill="#FAF6EE" />
      <path d="M32 60 Q0 46 14 90 Q34 88 42 70Z" fill="#8C5A2B" />
      <path d="M88 60 Q120 46 106 90 Q86 88 78 70Z" fill="#8C5A2B" />
      <path d="M50 96 L54 106 M60 98 L60 108 M70 96 L66 106" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PenguinChild({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="72" rx="32" ry="34" fill="#2B2B2B" />
      <ellipse cx="60" cy="78" rx="20" ry="24" fill="#FAF6EE" />
      <circle cx="60" cy="38" r="19" fill="#2B2B2B" />
      <ellipse cx="60" cy="42" rx="10" ry="9" fill="#FAF6EE" />
      <path d="M60 42 L70 46 L60 50 Z" fill="#E8A33D" />
      <circle cx="65" cy="38" r="2.6" fill="#2B2B2B" />
      <path d="M28 70 Q14 78 22 100" stroke="#2B2B2B" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M92 70 Q106 78 98 100" stroke="#2B2B2B" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M50 104 L46 112 M70 104 L74 112" stroke="#E8A33D" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
export function DuckChild({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="74" rx="32" ry="24" fill="#D9A441" />
      <circle cx="58" cy="42" r="18" fill="#D9A441" />
      <path d="M58 42 L84 46 Q88 48 84 50 L58 50 Z" fill="#E8752C" />
      <circle cx="64" cy="38" r="3" fill="#2B2B2B" />
      <path d="M32 62 Q10 56 18 80 Q30 80 40 68Z" fill="#C48F35" />
      <path d="M84 62 Q106 56 98 80 Q86 80 76 68Z" fill="#C48F35" />
      {/* webbed feet, signature detail for "swimming" */}
      <path d="M48 96 L44 104 L50 104 L48 108 L54 104" fill="#E8752C" />
      <path d="M68 96 L64 104 L70 104 L68 108 L74 104" fill="#E8752C" />
      {/* water ripple under the duck */}
      <path d="M26 100 Q40 96 54 100 T82 100" stroke="#7FB6C4" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SparrowChild({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="74" rx="28" ry="22" fill="#B08856" />
      <circle cx="58" cy="44" r="17" fill="#8A6A3F" />
      <path d="M58 44 L78 47 L58 51 Z" fill="#E8A33D" />
      <circle cx="64" cy="41" r="2.8" fill="#FAF6EE" />
      <path d="M36 64 Q16 58 22 82 Q34 82 42 70Z" fill="#7A5C36" />
      <path d="M80 64 Q100 58 94 82 Q82 82 74 70Z" fill="#7A5C36" />
      <path d="M52 94 L56 102 M64 96 L64 104" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round" />
      {/* twig for the nest, signature detail for "extending" */}
      <line x1="30" y1="98" x2="90" y2="98" stroke="#8A6A3F" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function OwlChild({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="70" rx="32" ry="30" fill="#6B4F3A" />
      <circle cx="46" cy="42" r="14" fill="#FAF6EE" />
      <circle cx="74" cy="42" r="14" fill="#FAF6EE" />
      <circle cx="46" cy="42" r="6" fill="#2B2B2B" />
      <circle cx="74" cy="42" r="6" fill="#2B2B2B" />
      <path d="M60 46 L66 54 L54 54 Z" fill="#E8A33D" />
      <path d="M30 32 L40 20 M90 32 L80 20" stroke="#6B4F3A" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 92 L36 100 M60 96 L60 104 M80 92 L84 100" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function SkyScene({ children }) {
  return (
    <svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="xMidYMid meet">
      <rect width="320" height="160" rx="16" fill="#EAF2EE" />
      <circle cx="270" cy="34" r="20" fill="#F3D48A" />
      <path d="M0 140 Q80 110 160 140 T320 140 V160 H0Z" fill="#CFE3D6" />
      {children}
    </svg>
  );
}
