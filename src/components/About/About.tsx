import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { aboutData } from '../../data/portfolio';
import { ScrollSequence } from './ScrollSequence';

// Constants:
// Section height: 180vh
// useScroll offset: ["start 85%", "end end"]
// pinAt: (0.85 * vh) / (0.85 * vh + 0.8 * vh) ≈ 0.52
// Frame mapping: [0, pinAt, 1] -> [12, 46, 72]
const PIN_AT = 0.52;

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Primary scroll progress across the 180vh section
  const { scrollYProgress: p } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end end'],
  });

  // Frame mapping: [0, pinAt, 1] -> [12, 46, 72]
  // Gesture completes at pinAt (0.52) when section top hits viewport top, then holds.
  const targetFrame = useTransform(p, [0, PIN_AT, 1], [12, 46, 72], {
    clamp: true,
  });

  // PROGRESS-SYNCED REVEAL: all elements finish before/at pinAt (0.52) at full opacity
  // Card shell fades in first
  const cardOpacity = useTransform(p, [0.0, 0.12], [0, 1]);
  const cardY = useTransform(p, [0.0, 0.12], [24, 0]);
  const cardBlur = useTransform(p, [0.0, 0.12], ['8px', '0px']);

  // Label
  const labelOpacity = useTransform(p, [0.05, 0.15], [0, 1]);
  const labelY = useTransform(p, [0.05, 0.15], [10, 0]);

  // Heading
  const headingOpacity = useTransform(p, [0.1, 0.24], [0, 1]);
  const headingY = useTransform(p, [0.1, 0.24], [14, 0]);
  const headingBlur = useTransform(p, [0.1, 0.24], ['6px', '0px']);

  // Paragraph 1 (lead)
  const p1Opacity = useTransform(p, [0.18, 0.32], [0, 1]);
  const p1Y = useTransform(p, [0.18, 0.32], [12, 0]);
  const p1Blur = useTransform(p, [0.18, 0.32], ['5px', '0px']);

  // Paragraph 2
  const p2Opacity = useTransform(p, [0.26, 0.4], [0, 1]);
  const p2Y = useTransform(p, [0.26, 0.4], [12, 0]);
  const p2Blur = useTransform(p, [0.26, 0.4], ['5px', '0px']);

  // Paragraph 3
  const p3Opacity = useTransform(p, [0.34, 0.48], [0, 1]);
  const p3Y = useTransform(p, [0.34, 0.48], [12, 0]);
  const p3Blur = useTransform(p, [0.34, 0.48], ['5px', '0px']);

  // Highlight Chips
  const chipsOpacity = useTransform(p, [0.42, PIN_AT], [0, 1]);
  const chipsY = useTransform(p, [0.42, PIN_AT], [10, 0]);

  // Reduced motion: static clean layout without scrubbing or pinning
  if (shouldReduceMotion) {
    return (
      <section
        id="about"
        className="relative min-h-screen text-white py-24 px-6 scroll-mt-24 flex items-center justify-center"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-[minmax(0,min(600px,38vw))_minmax(0,1fr)] lg:gap-x-[clamp(48px,4vw,96px)] items-stretch">
          {/* Glass Card Column */}
          <div className="w-full h-full flex justify-center lg:justify-start self-stretch z-20">
            <div className="relative w-[min(100%,600px)] h-full max-h-full flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-7 lg:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Top-edge 1px highlight */}
              <div
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#3054ff]/60 to-transparent pointer-events-none rounded-t-3xl"
              />
              {/* Soft blue inner glow */}
              <div
                aria-hidden="true"
                className="absolute -top-12 -left-12 w-48 h-48 bg-[#3054ff]/[0.06] blur-2xl rounded-full pointer-events-none"
              />

              <div className="flex flex-col">
                {/* Label */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3054ff] shadow-[0_0_8px_#3054ff]" />
                  <span className="text-xs uppercase tracking-[0.2em] text-[#b4c0ff] font-mono font-medium">
                    {aboutData.label}
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-[clamp(1.5rem,2.8svh,2.25rem)] font-semibold tracking-tight leading-[1.08] mb-3">
                  <span className="bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent block">
                    Turning Ideas into
                  </span>
                  <span className="bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent block">
                    Impactful Solutions
                  </span>
                </h2>

                {/* Paragraphs */}
                <div className="space-y-2 lg:space-y-2.5 mb-4">
                  <p className="text-white/90 font-normal text-[clamp(0.85rem,1.65svh,0.975rem)] leading-[1.55]">
                    {aboutData.paragraph1}
                  </p>
                  <p className="text-white/70 font-normal text-[clamp(0.8125rem,1.5svh,0.9rem)] leading-[1.55]">
                    {aboutData.paragraph2}
                  </p>
                  <p className="text-white/70 font-normal text-[clamp(0.8125rem,1.5svh,0.9rem)] leading-[1.55]">
                    {aboutData.paragraph3}
                  </p>
                </div>
              </div>

              {/* Chips row */}
              <div className="pt-3 mt-auto border-t border-white/10 flex flex-wrap gap-2">
                {aboutData.chips.map((chip) => (
                  <span
                    key={chip}
                    className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/5 border border-white/10 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Figure Column */}
          <div className="relative z-10 h-full self-stretch flex items-end justify-center lg:justify-end mb-0 pb-0 flex-shrink-0 w-full lg:w-[calc(100%+max(36px,50vw-604px))] lg:mr-[calc(-1*max(36px,50vw-604px))]">
            <ScrollSequence targetFrame={targetFrame} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative h-[180vh] text-white scroll-mt-24"
    >
      {/* Pinned 100svh Viewport Stage with navbar clearance (pt-24) and bottom clearance (pb-8) */}
      <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center justify-center pt-24 pb-8">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-full flex flex-col lg:grid lg:grid-cols-[minmax(0,min(600px,38vw))_minmax(0,1fr)] lg:gap-x-[clamp(48px,4vw,96px)] items-stretch">
          {/* Left Column: Glass Content Card (equal height, self-stretch) */}
          <div className="w-full h-full flex justify-center lg:justify-start self-stretch z-20">
            <motion.div
              style={{
                opacity: cardOpacity,
                y: cardY,
                filter: cardBlur,
              }}
              className="relative w-[min(100%,600px)] h-full max-h-full flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-7 lg:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* 1px top-edge highlight */}
              <div
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#3054ff]/60 to-transparent pointer-events-none rounded-t-3xl"
              />
              {/* Soft blue inner glow */}
              <div
                aria-hidden="true"
                className="absolute -top-12 -left-12 w-48 h-48 bg-[#3054ff]/[0.06] blur-2xl rounded-full pointer-events-none"
              />

              <div className="flex flex-col">
                {/* a) Small label "ABOUT ME" */}
                <motion.div
                  style={{ opacity: labelOpacity, y: labelY }}
                  className="flex items-center gap-2 mb-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3054ff] shadow-[0_0_8px_#3054ff]" />
                  <span className="text-xs uppercase tracking-[0.2em] text-[#b4c0ff] font-mono font-medium">
                    {aboutData.label}
                  </span>
                </motion.div>

                {/* b) Heading "Turning Ideas into Impactful Solutions" */}
                <motion.h2
                  style={{
                    opacity: headingOpacity,
                    y: headingY,
                    filter: headingBlur,
                  }}
                  className="text-[clamp(1.5rem,2.8svh,2.25rem)] font-semibold tracking-tight leading-[1.08] mb-3"
                >
                  <span className="bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent block">
                    Turning Ideas into
                  </span>
                  <span className="bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent block">
                    Impactful Solutions
                  </span>
                </motion.h2>

                {/* c) Three Paragraphs */}
                <div className="space-y-2 lg:space-y-2.5 mb-4">
                  <motion.p
                    style={{ opacity: p1Opacity, y: p1Y, filter: p1Blur }}
                    className="text-white/90 font-normal text-[clamp(0.85rem,1.65svh,0.975rem)] leading-[1.55]"
                  >
                    {aboutData.paragraph1}
                  </motion.p>
                  <motion.p
                    style={{ opacity: p2Opacity, y: p2Y, filter: p2Blur }}
                    className="text-white/70 font-normal text-[clamp(0.8125rem,1.5svh,0.9rem)] leading-[1.55]"
                  >
                    {aboutData.paragraph2}
                  </motion.p>
                  <motion.p
                    style={{ opacity: p3Opacity, y: p3Y, filter: p3Blur }}
                    className="text-white/70 font-normal text-[clamp(0.8125rem,1.5svh,0.9rem)] leading-[1.55]"
                  >
                    {aboutData.paragraph3}
                  </motion.p>
                </div>
              </div>

              {/* d) Chips row at bottom with mt-auto */}
              <motion.div
                style={{ opacity: chipsOpacity, y: chipsY }}
                className="pt-3 mt-auto border-t border-white/10 flex flex-wrap gap-2"
              >
                {aboutData.chips.map((chip) => (
                  <span
                    key={chip}
                    className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/5 border border-white/10 text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
                  >
                    {chip}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Figure (equal height, right bleed) */}
          <div className="relative z-10 h-full self-stretch flex items-end justify-center lg:justify-end mb-0 pb-0 flex-shrink-0 w-full lg:w-[calc(100%+max(36px,50vw-604px))] lg:mr-[calc(-1*max(36px,50vw-604px))]">
            <ScrollSequence
              targetFrame={targetFrame}
              containerRef={sectionRef}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
