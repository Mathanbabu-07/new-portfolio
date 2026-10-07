import React from 'react';
import { motion, type MotionValue, useTransform, useReducedMotion } from 'motion/react';

interface StageFXProps {
  pinProgress: MotionValue<number>;
  isMobile?: boolean;
}

/**
 * StageBackgroundFX
 * Layers placed behind the figure:
 * 1. Curtain lines (echo)
 * 2. Spotlight (centred behind head and chest)
 * 3. Floor glow (soft bottom ellipse)
 * 4. Ring pulse (pin .72 to .92)
 */
export const StageBackgroundFX: React.FC<StageFXProps> = ({
  pinProgress,
  isMobile = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Spotlight transforms: opacity .35 to 1 across pin 0 to .5, scale .9 to 1.1 across 0 to 1
  const spotlightOpacity = useTransform(pinProgress, [0, 0.5], [0.35, 1]);
  const spotlightScale = useTransform(pinProgress, [0, 1], [0.9, 1.1]);

  // Ring pulse at pin .72 to .92: scale .6 to 1.7, opacity .5 to 0
  const ringScale = useTransform(pinProgress, [0.72, 0.92], [0.6, 1.7]);
  const ringOpacity = useTransform(
    pinProgress,
    [0.719, 0.72, 0.92, 0.921],
    [0, 0.5, 0, 0]
  );

  const boxWidthClass = isMobile ? 'w-[220%] -left-[60%]' : 'w-[170%] -left-[35%]';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none overflow-visible"
    >
      {/* 1. Curtain Echo: repeating hairlines with radial fade */}
      <div
        className="pointer-events-none absolute -inset-[20%] opacity-60"
        style={{
          background:
            'repeating-linear-gradient(90deg, rgba(48,84,255,.07) 0 1px, transparent 1px 72px)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,1) 0%, transparent 70%)',
          maskImage:
            'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,1) 0%, transparent 70%)',
        }}
      />

      {/* 2. Spotlight: centred behind head and chest (50% 40%) */}
      <motion.div
        className={`pointer-events-none absolute top-[-10%] h-[120%] ${boxWidthClass} flex items-center justify-center`}
        style={{
          opacity: shouldReduceMotion ? 0.7 : spotlightOpacity,
          scale: shouldReduceMotion ? 1 : spotlightScale,
          transformOrigin: '50% 40%',
        }}
      >
        <div
          className="h-full w-full"
          style={{
            background:
              'radial-gradient(closest-side at 50% 40%, rgba(48,84,255,.42) 0%, rgba(48,84,255,.16) 55%, transparent 100%)',
          }}
        />
      </motion.div>

      {/* 3. Floor Glow: soft bottom ellipse so the dissolving torso does not float */}
      <div
        className="pointer-events-none absolute inset-x-[-20%] bottom-[-10%] h-[50%]"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(48,84,255,.18) 0%, transparent 100%)',
        }}
      />

      {/* 4. Ring Pulse: thin 1px ring expanding behind figure at pin .72 to .92 */}
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-[#3054ff]/40 shadow-[0_0_24px_rgba(48,84,255,0.3)]"
          style={{
            scale: ringScale,
            opacity: ringOpacity,
          }}
        />
      )}
    </div>
  );
};

/**
 * StageGlintFX
 * Short light streak across the lenses at glintAt (left 50%, top 24%)
 * Visible between pin .62 and .82, peak at .72
 */
export const StageGlintFX: React.FC<{ pinProgress: MotionValue<number> }> = ({
  pinProgress,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Glint opacity and scaleX: 0 at .62, 1 at .72, 0 at .82
  const glintOpacity = useTransform(
    pinProgress,
    [0.619, 0.62, 0.72, 0.82, 0.821],
    [0, 0, 1, 0, 0]
  );
  const glintScaleX = useTransform(
    pinProgress,
    [0.62, 0.72, 0.82],
    [0.1, 1, 0.1]
  );
  const sparkleScale = useTransform(
    pinProgress,
    [0.62, 0.72, 0.82],
    [0, 1.2, 0]
  );

  if (shouldReduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 select-none overflow-visible"
    >
      {/* Glint Anchor at left 50%, top 24% of the canvas box */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[24%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          opacity: glintOpacity,
        }}
      >
        {/* Horizontal light streak */}
        <motion.div
          className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#b4c0ff] to-transparent shadow-[0_0_12px_#b4c0ff,0_0_24px_#3054ff]"
          style={{
            scaleX: glintScaleX,
          }}
        />

        {/* Tiny 4-point sparkle at center */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          style={{
            scale: sparkleScale,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#b4c0ff] drop-shadow-[0_0_8px_#3054ff]"
          >
            <path
              d="M12 0L13.8 8.8L22.6 10.6L13.8 12.4L12 21.2L10.2 12.4L1.4 10.6L10.2 8.8L12 0Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};
