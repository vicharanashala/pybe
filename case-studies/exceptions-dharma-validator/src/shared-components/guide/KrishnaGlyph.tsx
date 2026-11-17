
export default function KrishnaGlyph({ size = 112 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none">
      <circle cx="100" cy="90" r="72" stroke="#E8B34D" strokeWidth="1" opacity="0.35" />
      <path
        d="M100 40 C 108 40 114 48 112 58 C 124 54 134 60 132 70 C 142 68 148 78 142 86 C 100 96 60 96 58 86 C 52 78 58 68 68 70 C 66 60 76 54 88 58 C 86 48 92 40 100 40 Z"
        fill="#E8B34D"
      />
      <circle cx="100" cy="112" r="30" fill="#0B1220" stroke="#E8B34D" strokeWidth="2" />
      <path d="M76 150 Q100 168 124 150" stroke="#C65D3B" strokeWidth="3" strokeLinecap="round" fill="none" />
      <line x1="70" y1="132" x2="130" y2="118" stroke="#C65D3B" strokeWidth="4" strokeLinecap="round" />
      <circle cx="70" cy="132" r="3" fill="#C65D3B" />
      <circle cx="130" cy="118" r="3" fill="#C65D3B" />
    </svg>
  );
}