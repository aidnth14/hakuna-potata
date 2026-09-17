import React from 'react';

interface PotatoSceneProps {
  mood?: 'golden' | 'cosmic' | 'crispy' | 'disco';
}

export const PotatoScene3D: React.FC<PotatoSceneProps> = ({ mood = 'golden' }) => {
  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
        mood === 'disco' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'
      }`}>
        <span className="text-3xl">🥔</span>
      </div>
    </div>
  );
};

export default PotatoScene3D;
