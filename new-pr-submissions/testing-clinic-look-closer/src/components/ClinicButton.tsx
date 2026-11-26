import React from 'react';

export type ClinicButtonVariant = 'coral' | 'amber' | 'green' | 'sky' | 'cream';
export type ClinicButtonSize = 'md' | 'sm';

interface ClinicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ClinicButtonVariant;
  size?: ClinicButtonSize;
}

const VARIANT_CLASSES: Record<ClinicButtonVariant, string> = {
  coral:
    'bg-[#D9544D] hover:bg-[#c54740] text-[#FFFDF7] focus-visible:ring-[#E8A33D]',
  amber:
    'bg-[#E8A33D] hover:bg-[#dc952d] text-[#24303C] focus-visible:ring-[#7FC4D6]',
  green:
    'bg-[#3E9A4D] hover:bg-[#348541] text-[#FFFDF7] focus-visible:ring-[#E8A33D]',
  sky:
    'bg-[#A8D8E8] hover:bg-[#7FC4D6] text-[#24303C] focus-visible:ring-[#E8A33D]',
  cream:
    'bg-[#F5EFE0] hover:bg-[#E8DFCA] disabled:hover:bg-[#F5EFE0] text-[#24303C] focus-visible:ring-[#E8A33D]',
};

const SIZE_CLASSES: Record<ClinicButtonSize, string> = {
  md: 'rounded-xl text-base sm:text-lg px-6 py-2.5 border-[3px] shadow-[0_4px_0_#24303C]',
  sm: 'rounded-xl text-xs sm:text-sm px-3.5 py-1.5 border-[2.5px] shadow-[0_2px_0_#24303C]',
};

export const ClinicButton: React.FC<ClinicButtonProps> = ({
  variant = 'coral',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn-press-spring whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed font-display font-bold border-[#24303C] focus-visible:outline-none focus-visible:ring-4 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
