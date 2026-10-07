import React from 'react';
import { TechIcon } from './techIcons';

interface TechChipProps {
  name: string;
}

export const TechChip: React.FC<TechChipProps> = ({ name }) => {
  return (
    <li className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-xs text-white/80 transition-colors duration-200 hover:border-[#3054ff]/60 hover:text-white select-none">
      <span
        aria-hidden="true"
        className="text-white/60 transition-colors duration-200 group-hover:text-[#b4c0ff]"
      >
        <TechIcon name={name} className="w-3.5 h-3.5" />
      </span>
      <span className="font-instrument-sans font-medium tracking-tight">{name}</span>
    </li>
  );
};
