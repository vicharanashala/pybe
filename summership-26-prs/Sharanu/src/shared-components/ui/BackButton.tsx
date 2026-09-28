import type { ButtonHTMLAttributes } from "react";
import { ArrowLeft } from "lucide-react";

export default function BackButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="flex items-center gap-2 text-muted hover:text-ink px-5 py-3 transition-colors text-sm"
      {...props}
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
}