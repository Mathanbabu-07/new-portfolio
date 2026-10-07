import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { projects, projectsSectionData } from '../../data/projects';
import { ProjectCard } from './ProjectCard';

export const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Drift section ambience opposite to scroll (+/-50px)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const glowDrift1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const glowDrift2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative scroll-mt-24 py-24 lg:py-32 select-none overflow-visible"
    >
      {/* 
        Section Ambience:
        - Faint curtain hairlines with radial mask
        - Two radial-gradient glows (blue at 12% 20%, indigo at 88% 70%) drifting opposite to scroll (+/-50px)
        - No box-shadows, no bg boxes, no blur-* blobs
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 select-none overflow-visible"
      >
        {/* Curtain Hairlines */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(48,84,255,.05) 0 1px, transparent 1px 72px)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,1) 0%, transparent 75%)',
            maskImage:
              'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,1) 0%, transparent 75%)',
          }}
        />

        {/* Ambient Glow 1 (Blue at 12% 20%) */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : glowDrift1,
          }}
          className="absolute left-[-10%] top-[10%] h-[700px] w-[700px]"
        >
          <div
            className="h-full w-full"
            style={{
              background:
                'radial-gradient(closest-side at 50% 50%, rgba(48,84,255,.14) 0%, transparent 75%)',
            }}
          />
        </motion.div>

        {/* Ambient Glow 2 (Indigo at 88% 70%) */}
        <motion.div
          style={{
            y: shouldReduceMotion ? 0 : glowDrift2,
          }}
          className="absolute right-[-10%] bottom-[10%] h-[700px] w-[700px]"
        >
          <div
            className="h-full w-full"
            style={{
              background:
                'radial-gradient(closest-side at 50% 50%, rgba(79,70,229,.14) 0%, transparent 75%)',
            }}
          />
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3054ff] shadow-[0_0_8px_#3054ff]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#b4c0ff] font-medium">
                {projectsSectionData.label}
              </span>
            </div>

            <h2 className="font-instrument-sans font-semibold tracking-tight text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]">
              <span className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent">
                {projectsSectionData.heading}
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-base text-white/70 leading-[1.65] lg:text-lg">
              {projectsSectionData.subtitle}
            </p>
          </div>

          {/* Right-aligned Mono Counter on Desktop */}
          <div className="hidden lg:block shrink-0 pb-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#b4c0ff]/60">
              {projectsSectionData.counter}
            </span>
          </div>
        </div>

        {/* 2-Column Grid with [perspective:1200px] per cell */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 auto-rows-fr">
          {projects.map((project, idx) => (
            <div key={project.id} className="[perspective:1200px] h-full flex flex-col">
              <ProjectCard project={project} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
