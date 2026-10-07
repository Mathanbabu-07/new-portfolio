import React from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { Award, Trophy, Medal } from 'lucide-react';
import type { Achievement } from '../../data/achievements';
import { getSlatOpen, getSlatWidth, getImageOffsetX } from './slatMath';

interface SlatProps {
  item: Achievement;
  index: number;
  t: MotionValue<number>;
  Wo: number;
  Wc: number;
  Hs: number;
  isActive: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const Slat: React.FC<SlatProps> = ({
  item,
  index,
  t,
  Wo,
  Wc,
  Hs,
  isActive,
  onClick,
  onKeyDown,
}) => {
  // Derive continuous open factor (0 to 1) for this slat from t
  const open_i = useTransform(t, (val) => getSlatOpen(index, val));

  // Width of this slat: Wc + (Wo - Wc) * open_i
  const width = useTransform(open_i, (o) => getSlatWidth(o, Wo, Wc));

  // Translation of inner image: imgX = -(Wo - w_i) * focusX
  const imgX = useTransform(width, (w) => getImageOffsetX(Wo, w, item.focusX));

  // Slat border color from white/10 (closed) to rgba(110,140,255,.55) (open)
  const borderColor = useTransform(
    open_i,
    (o) => `rgba(${Math.round(255 - 145 * o)}, ${Math.round(255 - 115 * o)}, 255, ${0.1 + 0.45 * o})`
  );

  // Overlay opacities
  const closedOpacity = useTransform(open_i, (o) => Math.max(0, 1 - o));
  const darkOverlayOpacity = useTransform(open_i, (o) => 0.55 * (1 - o));

  const renderIcon = (className = 'w-4 h-4') => {
    switch (item.icon) {
      case 'Trophy':
        return <Trophy className={className} aria-hidden="true" />;
      case 'Medal':
        return <Medal className={className} aria-hidden="true" />;
      case 'Award':
      default:
        return <Award className={className} aria-hidden="true" />;
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      style={{
        width,
        height: `${Hs}px`,
        borderColor,
      }}
      aria-label={`Achievement ${index + 1} of 5: ${item.title}`}
      aria-current={isActive ? 'true' : undefined}
      className="relative shrink-0 overflow-hidden rounded-[22px] border bg-[#050a1c] p-0 text-left cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black will-change-[width]"
    >
      {/* 
        REVEAL, NOT RESIZE:
        Inner image wrapper is ALWAYS exactly Wo x Hs px.
        It is translated by imgX = -(Wo - w_i) * focusX.
      */}
      <motion.div
        style={{
          width: `${Wo}px`,
          height: `${Hs}px`,
          x: imgX,
        }}
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
      >
        <img
          src={`${item.image}-1240.webp`}
          srcSet={`${item.image}-620.webp 620w, ${item.image}-1240.webp 1240w`}
          sizes={`${Math.round(Wo)}px`}
          width={1240}
          height={800}
          loading="lazy"
          decoding="async"
          alt={item.alt}
          className="h-full w-full object-cover block select-none pointer-events-none"
        />
      </motion.div>

      {/* Darkness overlay (0.55 on closed, 0 on open) */}
      <motion.div
        aria-hidden="true"
        style={{
          opacity: darkOverlayOpacity,
        }}
        className="pointer-events-none absolute inset-0 bg-[#030614]"
      />

      {/* Fluted-glass sheen on closed slats */}
      <motion.div
        aria-hidden="true"
        style={{
          opacity: closedOpacity,
          background:
            'linear-gradient(90deg, rgba(255,255,255,.10) 0%, transparent 35%, rgba(0,0,0,.28) 100%)',
        }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Top-Left Number Chip (Always visible) */}
      <div className="pointer-events-none absolute left-3 top-3 z-10">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-black/55 px-2.5 py-0.5 font-mono text-xs font-semibold text-white/90 shadow-sm backdrop-blur-sm">
          0{index + 1}
        </span>
      </div>

      {/* Closed Slat Content: Icon + Vertical ShortTitle (opacity 1 - open_i) */}
      <motion.div
        aria-hidden="true"
        style={{
          opacity: closedOpacity,
        }}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end pb-5 gap-3"
      >
        <span className="text-[#b4c0ff] drop-shadow-md">
          {renderIcon('w-4 h-4')}
        </span>
        <span className="font-instrument-sans text-sm font-medium tracking-wide text-white/85 [writing-mode:vertical-rl] rotate-180 drop-shadow-md">
          {item.shortTitle}
        </span>
      </motion.div>

      {/* Open Slat Content: Top-Right Badge Chip (opacity open_i) */}
      <motion.div
        aria-hidden="true"
        style={{
          opacity: open_i,
        }}
        className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs text-white/95 shadow-md backdrop-blur-sm"
      >
        <span className="text-[#b4c0ff]">{renderIcon('w-3.5 h-3.5')}</span>
        <span className="font-instrument-sans font-medium">{item.badges[0]}</span>
      </motion.div>
    </motion.button>
  );
};
