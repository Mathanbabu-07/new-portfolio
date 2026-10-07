import { useRef, useCallback, useEffect } from 'react';
import { animate, type AnimationPlaybackControls } from 'motion/react';

export function useScrollTo() {
  const animRef = useRef<AnimationPlaybackControls | null>(null);

  const stop = useCallback(() => {
    if (animRef.current) {
      animRef.current.stop();
      animRef.current = null;
    }
  }, []);

  const scrollTo = useCallback((targetY: number, velocity = 0) => {
    stop();
    const startY = window.scrollY;
    if (Math.abs(targetY - startY) < 1) return;

    animRef.current = animate(startY, targetY, {
      type: 'spring',
      stiffness: 150,
      damping: 26,
      velocity,
      onUpdate: (y) => {
        window.scrollTo({ top: y, behavior: 'instant' });
      },
      onComplete: () => {
        animRef.current = null;
      },
    });
  }, [stop]);

  // Stop spring animation on user interrupt (wheel, touchstart, keydown)
  useEffect(() => {
    const handleInterrupt = () => {
      stop();
    };

    window.addEventListener('wheel', handleInterrupt, { passive: true });
    window.addEventListener('touchstart', handleInterrupt, { passive: true });
    window.addEventListener('keydown', handleInterrupt);

    return () => {
      stop();
      window.removeEventListener('wheel', handleInterrupt);
      window.removeEventListener('touchstart', handleInterrupt);
      window.removeEventListener('keydown', handleInterrupt);
    };
  }, [stop]);

  return { scrollTo, stop };
}
