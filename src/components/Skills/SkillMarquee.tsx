import React, { useRef, useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { allSkillNames } from '../../data/skills';

interface SkillMarqueeProps {
  className?: string;
}

export const SkillMarquee: React.FC<SkillMarqueeProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '100px 0px 100px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animation running state: only runs when in view and motion is not reduced
  const playState = isInView && !shouldReduceMotion ? 'running' : 'paused';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`group relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-8 select-none ${className}`}
      style={{
        WebkitMaskImage:
          'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        maskImage:
          'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <style>{`
        @keyframes marqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>

      {/* Track containing two identical groups for seamless infinite scroll */}
      <div
        className="flex w-max items-center will-change-transform group-hover:[animation-play-state:paused]"
        style={{
          animation: shouldReduceMotion
            ? 'none'
            : 'marqueeScroll 60s linear infinite',
          animationPlayState: playState,
        }}
      >
        {/* Group 1 */}
        <div className="flex items-center">
          {allSkillNames.map((name, index) => (
            <React.Fragment key={`group1-${name}-${index}`}>
              <span
                className="font-instrument-serif text-5xl italic text-transparent lg:text-7xl whitespace-nowrap"
                style={{
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.22)',
                }}
              >
                {name}
              </span>
              <span className="mx-6 text-sm text-[#3054ff]/80 lg:mx-8 inline-block align-middle select-none">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Group 2 (Identical Clone) */}
        <div className="flex items-center">
          {allSkillNames.map((name, index) => (
            <React.Fragment key={`group2-${name}-${index}`}>
              <span
                className="font-instrument-serif text-5xl italic text-transparent lg:text-7xl whitespace-nowrap"
                style={{
                  WebkitTextStroke: '1px rgba(255, 255, 255, 0.22)',
                }}
              >
                {name}
              </span>
              <span className="mx-6 text-sm text-[#3054ff]/80 lg:mx-8 inline-block align-middle select-none">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
