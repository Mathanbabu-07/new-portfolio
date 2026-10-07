import React, { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { achievementsSectionData } from '../../data/achievements';
import { CurtainStage } from './CurtainStage';
import { MobileAccordion } from './MobileAccordion';
import { EducationRow } from './EducationRow';

export const Achievements: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isDesktopMode, setIsDesktopMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024 && window.innerHeight >= 640;
  });

  useEffect(() => {
    const checkMode = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      const isTallEnough = window.innerHeight >= 640;
      setIsDesktopMode(isLargeScreen && isTallEnough);
    };

    checkMode();
    window.addEventListener('resize', checkMode);
    return () => window.removeEventListener('resize', checkMode);
  }, []);

  const showDesktop = isDesktopMode && !shouldReduceMotion;

  return (
    <section
      id="achievements"
      aria-label="Achievements and Education"
      className="relative scroll-mt-24 py-24 lg:py-32 [overflow-x:clip] select-none"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Centered Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          {/* Label */}
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3054ff] shadow-[0_0_8px_#3054ff]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#b4c0ff] font-medium">
              {achievementsSectionData.label}
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-instrument-sans font-semibold tracking-tight text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] mb-4">
            <span className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent">
              {achievementsSectionData.heading}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto max-w-xl text-base text-white/70 leading-[1.65] lg:text-lg">
            {achievementsSectionData.subtitle}
          </p>
        </div>
      </div>

      {/* Main Interactive Stage: Desktop Curtain Slat Stage OR Mobile Accordion */}
      {showDesktop ? <CurtainStage /> : <MobileAccordion />}

      {/* Education Row */}
      <EducationRow />
    </section>
  );
};
