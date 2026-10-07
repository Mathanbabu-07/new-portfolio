import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, animate } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.5,
  });

  // Circumference of 48px circle with radius 21: 2 * PI * 21 = 131.947
  const circumference = 131.947;
  const strokeDashoffset = useTransform(
    smoothProgress,
    (val) => circumference * (1 - Math.max(0, Math.min(1, val)))
  );

  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const handleScrollToTop = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }

    const cancel = () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
      stopEvents.forEach((ev) => window.removeEventListener(ev, cancel));
    };

    const stopEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'];
    stopEvents.forEach((ev) =>
      window.addEventListener(ev, cancel, { passive: true, once: true })
    );

    const fromY = window.scrollY;
    controlsRef.current = animate(fromY, 0, {
      type: 'spring',
      stiffness: 120,
      damping: 26,
      onUpdate: (y) => {
        window.scrollTo({ top: y, behavior: 'instant' });
      },
      onComplete: () => {
        stopEvents.forEach((ev) => window.removeEventListener(ev, cancel));
        controlsRef.current = null;
      },
    });
  };

  useEffect(() => {
    return () => {
      if (controlsRef.current) controlsRef.current.stop();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Back to top"
      className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#070d24]/80 text-white/70 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:text-white hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff]"
    >
      {/* SVG progress indicator ring */}
      <svg
        className="pointer-events-none absolute inset-0 -rotate-90 h-full w-full p-0.5"
        viewBox="0 0 48 48"
      >
        <defs>
          <linearGradient id="back-to-top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3054ff" />
            <stop offset="100%" stopColor="#b4c0ff" />
          </linearGradient>
        </defs>

        {/* Background track circle */}
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="2"
        />

        {/* Animated Progress Circle */}
        <motion.circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="url(#back-to-top-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>

      <ArrowUp className="relative z-10 h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
};
