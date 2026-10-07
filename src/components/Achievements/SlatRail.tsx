import React from 'react';
import { motion, type MotionValue, useTransform } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSlatOpen } from './slatMath';

interface SlatRailProps {
  t: MotionValue<number>;
  activeIndex: number;
  hasMoved: boolean;
  onSelect: (index: number) => void;
}

export const SlatRail: React.FC<SlatRailProps> = ({
  t,
  activeIndex,
  hasMoved,
  onSelect,
}) => {
  return (
    <div className="relative flex h-9 w-full items-center justify-between select-none">
      {/* 5 Segments */}
      <div className="flex items-center gap-2 sm:gap-3">
        {[0, 1, 2, 3, 4].map((idx) => (
          <RailSegment
            key={idx}
            index={idx}
            t={t}
            isActive={activeIndex === idx}
            onClick={() => onSelect(idx)}
          />
        ))}
      </div>

      {/* "Scroll or drag" Hint Pill (disappears after user moves) */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{
          opacity: hasMoved ? 0 : 1,
          y: hasMoved ? -4 : 0,
          pointerEvents: hasMoved ? 'none' : 'auto',
        }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-white/60 tracking-wider backdrop-blur-sm"
      >
        <ChevronLeft className="h-3 w-3 animate-pulse text-[#b4c0ff]" aria-hidden="true" />
        <span>Scroll or drag</span>
        <ChevronRight className="h-3 w-3 animate-pulse text-[#b4c0ff]" aria-hidden="true" />
      </motion.div>
    </div>
  );
};

const RailSegment: React.FC<{
  index: number;
  t: MotionValue<number>;
  isActive: boolean;
  onClick: () => void;
}> = ({ index, t, isActive, onClick }) => {
  // Compute continuous activation (0 to 1) for this segment from t
  const openFactor = useTransform(t, (val) => getSlatOpen(index, val));

  const width = useTransform(openFactor, [0, 1], ['28px', '56px']);
  const bgOpacity = useTransform(openFactor, [0, 1], [0.15, 1]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Jump to achievement ${index + 1}`}
      className="group relative flex h-7 items-center justify-center rounded-full border border-white/10 p-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff]"
    >
      <motion.div
        style={{
          width,
        }}
        className="relative flex h-full items-center justify-center overflow-hidden rounded-full transition-colors"
      >
        {/* Dynamic active gradient fill */}
        <motion.div
          style={{
            opacity: bgOpacity,
          }}
          className="absolute inset-0 bg-gradient-to-r from-[#3054ff] to-[#b4c0ff]"
        />

        {/* Index label */}
        <span
          className={`relative z-10 font-mono text-[10px] font-semibold transition-colors duration-200 ${
            isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
          }`}
        >
          0{index + 1}
        </span>
      </motion.div>
    </button>
  );
};
