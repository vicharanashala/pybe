import { Sparkles } from "lucide-react";

interface BadgeProps {
  label: string;
}

export default function Badge({ label }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#1C1730] border border-gold/40 text-gold text-xs px-3 py-1.5 rounded-full">
      <Sparkles size={12} />
      {label}
    </span>
  );
}