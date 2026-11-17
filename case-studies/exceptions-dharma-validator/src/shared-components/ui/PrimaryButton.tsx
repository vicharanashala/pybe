import type { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "gold" | "vermilion";
}

export default function PrimaryButton({ tone = "gold", className = "", children, ...rest }: PrimaryButtonProps) {
  const toneClasses =
    tone === "gold"
      ? "bg-gold text-bg hover:opacity-90"
      : "bg-vermilion text-ink hover:opacity-90";

  return (
    <button
      className={`inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full transition-opacity text-sm ${toneClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}