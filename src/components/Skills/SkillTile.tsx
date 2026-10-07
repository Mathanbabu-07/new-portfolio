import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SkillIcon } from './skillIcons';
import { tileVariants } from './motionVariants';

interface SkillTileProps {
  name: string;
  className?: string;
  iconClassName?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SkillTile: React.FC<SkillTileProps> = ({
  name,
  className = '',
  iconClassName,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      tabIndex={0}
      variants={tileVariants}
      custom={shouldReduceMotion}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3.5 py-3 text-white/85 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#3054ff]/60 hover:bg-[#3054ff]/10 hover:shadow-[0_0_24px_-6px_rgba(48,84,255,.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-default select-none ${className}`}
    >
      {/* 28px Icon Box */}
      <div
        aria-hidden="true"
        className={`w-7 h-7 flex-shrink-0 flex items-center justify-center text-white/70 group-hover:text-[#b4c0ff] transition-colors duration-200 ${
          iconClassName || ''
        }`}
      >
        <SkillIcon name={name} className="w-[18px] h-[18px]" />
      </div>

      {/* Name */}
      <span className="text-sm lg:text-[15px] font-medium leading-none text-white/85 group-hover:text-white transition-colors duration-200">
        {name}
      </span>
    </motion.li>
  );
};
