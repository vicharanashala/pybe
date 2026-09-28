
interface ProgressRailProps {
  total: number;
  current: number; // 0-indexed
  labels?: string[]; // optional, shown on hover/aria-label
}

export default function ProgressRail({ total, current, labels }: ProgressRailProps) {
  return (
    <div className="flex gap-1.5 w-full" role="progressbar" aria-valuenow={current + 1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          title={labels?.[i]}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i <= current ? "bg-gold" : "bg-line"
          }`}
        />
      ))}
    </div>
  );
}