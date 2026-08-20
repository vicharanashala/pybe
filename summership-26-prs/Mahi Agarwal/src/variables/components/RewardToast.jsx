import React from 'react';
import { Gem } from 'lucide-react';

export default function RewardToast({ label = 'Memory Gem earned!' }) {
  return (
    <div className="dm-reward-toast">
      <Gem size={16} />
      <span>{label}</span>
    </div>
  );
}
