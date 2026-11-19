import { useState } from 'react';
import { Shield } from 'lucide-react';

interface MuseumImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function MuseumImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Royal Heritage Museum Archive',
}: MuseumImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#121826] via-[#0B0E17] to-[#1A1510] border border-[#D4AF37]/25 text-[#F4EFE6] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Shield className="w-10 h-10 text-[#D4AF37] mb-3" strokeWidth={1.5} />
        <span className="font-display text-sm tracking-wide text-[#E5C158]">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
