import React from 'react';
import { CHARACTERS } from '../data/storyData';

export default function CharacterAvatar({ charKey, size = 'md' }) {
  const char = CHARACTERS[charKey] || {
    name: charKey,
    color: 'from-amber-500 to-orange-600',
    avatarSvg: '👤'
  };

  const dimensions = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  }[size] || 'w-10 h-10 text-xl';

  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative ${dimensions} rounded-xl bg-gradient-to-tr ${char.color} flex items-center justify-center shadow-md border border-white/20`}>
        <span>{char.avatarSvg}</span>
      </div>
      <div className="font-extrabold text-amber-200 text-base tracking-wide">
        {char.name}
      </div>
    </div>
  );
}
