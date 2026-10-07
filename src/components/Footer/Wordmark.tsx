import React from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';

interface WordmarkProps {
  footerRef: React.RefObject<HTMLElement | null>;
}

export const Wordmark: React.FC<WordmarkProps> = ({ footerRef }) => {
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: footerRef as React.RefObject<HTMLElement>,
    offset: ['start end', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.6,
  });

  const translateY = useTransform(smoothProgress, [0, 1], ['40%', '0%']);
  const opacity = useTransform(smoothProgress, [0, 0.4, 1], [0, 0.6, 1]);
  const sweepBgPos = useTransform(smoothProgress, [0, 1], ['120% 0%', '-40% 0%']);

  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden select-none flex justify-center pointer-events-none h-[clamp(56px,14.5vw,220px)] mt-4 mb-2"
    >
      <motion.div
        style={{
          y: shouldReduceMotion ? '0%' : translateY,
          opacity: shouldReduceMotion ? 1 : opacity,
        }}
        className="relative text-[clamp(64px,17vw,260px)] font-instrument-serif font-normal leading-none whitespace-nowrap text-center tracking-wide"
      >
        {/* Base stroke outline layer */}
        <span
          className="block"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(180,192,255,.22)',
          }}
        >
          MATHAN BABU
        </span>

        {/* Top light sweep layer across text strokes */}
        <motion.span
          className="absolute inset-0 block"
          style={{
            color: 'transparent',
            background:
              'linear-gradient(100deg, transparent 40%, rgba(180,192,255,.65) 50%, transparent 60%)',
            backgroundSize: '250% 100%',
            backgroundPosition: shouldReduceMotion ? '50% 0%' : sweepBgPos,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextStroke: '1px transparent',
          }}
        >
          MATHAN BABU
        </motion.span>
      </motion.div>
    </div>
  );
};
