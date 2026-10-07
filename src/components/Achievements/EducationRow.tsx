import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { GraduationCap, School, MapPin } from 'lucide-react';
import { educationItems } from '../../data/achievements';

export const EducationRow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10% 0px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <div ref={containerRef} className="mt-20 lg:mt-28 w-full max-w-5xl mx-auto px-6 select-none">
      {/* Centered Mono Label */}
      <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#b4c0ff] font-semibold">
          EDUCATION
        </span>
        <div className="h-0.5 w-8 rounded-full bg-gradient-to-r from-transparent via-[#3054ff] to-transparent" />
      </div>

      {/* Two Glass Cards Side by Side (Stacked on Mobile) */}
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Animated Connector Line on lg screens */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[2px] bg-gradient-to-r from-[#3054ff] to-[#b4c0ff] origin-center z-10 pointer-events-none"
          />
        )}

        {educationItems.map((item, idx) => {
          const isCollege = item.kind === 'College';

          return (
            <motion.div
              key={item.id}
              initial={
                shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 24, filter: 'blur(6px)' }
              }
              animate={
                isInView
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 24, filter: 'blur(6px)' }
              }
              transition={{
                duration: 0.7,
                delay: idx * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#070d24]/60 p-6 lg:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_16px_40px_rgba(0,0,0,.35)] backdrop-blur-md transition-all duration-300 hover:border-[#3054ff]/50 hover:-translate-y-1"
            >
              <div className="flex flex-col gap-4">
                {/* Header row: Icon + Kind Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3054ff]/30 bg-[#3054ff]/15 text-[#b4c0ff] shadow-sm">
                    {isCollege ? (
                      <GraduationCap className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <School className="h-5 w-5" aria-hidden="true" />
                    )}
                  </div>

                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#b4c0ff]/70 font-medium">
                    {item.kind}
                  </span>
                </div>

                {/* Headline & Institution */}
                <div>
                  <h4 className="font-instrument-sans text-xl lg:text-2xl font-semibold tracking-tight text-white mb-1">
                    {item.headline}
                  </h4>

                  {item.institution && (
                    <p className="font-instrument-serif italic text-lg text-white/80">
                      {item.institution}
                    </p>
                  )}
                </div>
              </div>

              {/* Location Chip */}
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-instrument-sans text-xs text-white/70">
                  <MapPin className="h-3.5 w-3.5 text-[#b4c0ff]" aria-hidden="true" />
                  <span>{item.location}</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
