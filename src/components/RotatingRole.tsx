import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface RotatingRoleProps {
  roles: string[];
  rolePrefix?: string;
}

export const RotatingRole = ({ roles, rolePrefix = "ASPIRING" }: RotatingRoleProps) => {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const currentRole = roles[index] || roles[0];

  const measureRef = useRef<HTMLSpanElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number | 'auto'>('auto');

  // Rotate roles every 2800ms unless tab is hidden or reduced motion is active
  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setIndex((prev) => (prev + 1) % roles.length);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [roles.length, shouldReduceMotion]);

  // Measure exact width of the current role word
  useLayoutEffect(() => {
    if (measureRef.current) {
      setMeasuredWidth(measureRef.current.offsetWidth);
    }
  }, [currentRole]);

  // Update on window resize to ensure correct width across breakpoints
  useEffect(() => {
    const handleResize = () => {
      if (measureRef.current) {
        setMeasuredWidth(measureRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex items-center justify-center flex-wrap gap-x-2.5 sm:gap-x-3 text-base sm:text-xl lg:text-2xl font-medium tracking-[0.18em] uppercase font-instrument-sans select-none">
      {/* Screen reader announcement */}
      <span className="sr-only">
        {rolePrefix} {roles.join(" and ")}
      </span>

      {/* Static prefix: "ASPIRING" never moves or re-renders */}
      <span className="text-white/70">{rolePrefix}</span>

      {/* Hidden measuring span for accurate dynamic width calculation without layout jumps */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="absolute -top-[9999px] left-0 opacity-0 pointer-events-none whitespace-nowrap text-base sm:text-xl lg:text-2xl font-medium tracking-[0.18em] uppercase font-instrument-sans"
      >
        {currentRole}
      </span>

      {/* Animated rotating role word wrapper */}
      <motion.span
        aria-hidden="true"
        animate={{ width: measuredWidth }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 30 }
        }
        style={{ perspective: 600 }}
        className="relative inline-flex flex-col items-center justify-center overflow-hidden py-1 align-baseline"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentRole}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { y: "100%", opacity: 0, filter: "blur(8px)", rotateX: -40 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    y: "-100%",
                    opacity: 0,
                    filter: "blur(8px)",
                    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
            className="bg-gradient-to-r from-white to-[#b4c0ff] bg-clip-text text-transparent whitespace-nowrap block"
          >
            {currentRole}
          </motion.span>
        </AnimatePresence>

        {/* Accent underline that redraws on every role change */}
        {!shouldReduceMotion && (
          <motion.span
            key={`underline-${currentRole}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3054ff] to-[#b4c0ff] origin-left rounded-full"
          />
        )}
      </motion.span>
    </div>
  );
};
