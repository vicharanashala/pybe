
interface ChakraProps {
  size?: number;
  spinning?: boolean;
  className?: string;
}

export default function Chakra({ size = 16, spinning = true, className = "" }: ChakraProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={`${spinning ? "animate-spin" : ""} ${className}`}
      style={spinning ? { animationDuration: "18s" } : undefined}
    >
      <circle cx="50" cy="50" r="46" stroke="#E8B34D" strokeWidth="2" opacity="0.5" />
      <circle cx="50" cy="50" r="6" fill="#E8B34D" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * 14}
            y1={50 + Math.sin(a) * 14}
            x2={50 + Math.cos(a) * 46}
            y2={50 + Math.sin(a) * 46}
            stroke="#E8B34D"
            strokeWidth="1.5"
            opacity="0.6"
          />
        );
      })}
    </svg>
  );
}