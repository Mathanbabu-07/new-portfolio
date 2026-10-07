import React from 'react';
import { motion, type MotionValue } from 'motion/react';
import { Lock } from 'lucide-react';

interface BrowserFrameProps {
  name: string;
  urlLabel?: string;
  image: string;
  alt: string;
  overlayOpacity?: MotionValue<number>;
  dollyY?: MotionValue<string>;
  dollyScale?: MotionValue<number>;
  isHovered?: boolean;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  name,
  urlLabel,
  image,
  alt,
  overlayOpacity,
  dollyY,
  dollyScale,
  isHovered = false,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050a1c] shadow-inner select-none">
      {/* 36px Top Bar */}
      <div className="flex h-9 items-center justify-between border-b border-white/10 bg-white/[0.02] px-3.5">
        {/* Three dots */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>

        {/* URL Pill */}
        <div className="flex max-w-[280px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-[11px] font-mono text-white/50 truncate">
          <Lock className="h-2.5 w-2.5 text-white/40 shrink-0" aria-hidden="true" />
          <span className="truncate">{urlLabel || name}</span>
        </div>

        {/* Spacer to keep URL centered */}
        <div className="w-12 shrink-0" aria-hidden="true" />
      </div>

      {/* Image Area with EXACT 1400/652 aspect ratio */}
      <div className="relative aspect-[1400/652] w-full overflow-hidden bg-[#050a1c]">
        {/* Camera Dolly Wrapper (slight parallax shift + subtle scale) */}
        <motion.div
          style={{
            y: dollyY,
            scale: dollyScale,
          }}
          className="relative h-full w-full will-change-transform"
        >
          <img
            src={`${image}-1400.webp`}
            srcSet={`${image}-700.webp 700w, ${image}-1400.webp 1400w`}
            sizes="(min-width: 1024px) 560px, 92vw"
            width={1400}
            height={652}
            loading="lazy"
            decoding="async"
            alt={alt}
            className="h-full w-full object-cover block select-none pointer-events-none"
          />
        </motion.div>

        {/* Dark overlay driven by scroll focus (0.55 to 0) to tame bright light-theme screenshots */}
        {overlayOpacity && (
          <motion.div
            style={{
              opacity: overlayOpacity,
            }}
            animate={isHovered ? { opacity: 0 } : undefined}
            transition={{ duration: 0.3 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#030614]"
          />
        )}

        {/* Faint accent tint overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, var(--accent), transparent 85%)',
          }}
        />
      </div>
    </div>
  );
};
