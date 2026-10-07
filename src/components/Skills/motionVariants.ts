import type { Variants } from 'motion/react';

export const EASE_CUSTOM = [0.22, 1, 0.36, 1] as const;

export const tileVariants: Variants = {
  hidden: (shouldReduceMotion: boolean) => ({
    opacity: 0,
    y: shouldReduceMotion ? 0 : 12,
    scale: shouldReduceMotion ? 1 : 0.96,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: EASE_CUSTOM,
    },
  },
};

export const cardVariants: Variants = {
  hidden: (shouldReduceMotion: boolean) => ({
    opacity: 0,
    y: shouldReduceMotion ? 0 : 28,
    filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)',
  }),
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: EASE_CUSTOM,
    },
  },
};
