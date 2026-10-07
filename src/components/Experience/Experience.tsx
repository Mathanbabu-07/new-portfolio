import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { experienceData } from '../../data/experience';
import { JourneySpine, SpineClosingPill } from './JourneySpine';
import { ExperienceRow } from './ExperienceRow';

const BASE_EASE = [0.22, 1, 0.36, 1] as const;

export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(sectionRef, {
    once: true,
    margin: '0px 0px -15% 0px',
  });
  const shouldReduceMotion = useReducedMotion();

  const titleWords = experienceData.title.split(' '); // ["Experience", "&", "Journey"]

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative scroll-mt-24 py-24 lg:py-32 pb-40 select-none"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* CENTERED Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={
              isHeaderInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: shouldReduceMotion ? 0 : 12 }
            }
            transition={{ duration: 0.6, ease: BASE_EASE }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3054ff] shadow-[0_0_8px_#3054ff]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#b4c0ff] font-mono font-medium">
              {experienceData.label}
            </span>
          </motion.div>

          {/* H2 Heading with Masked Word Reveal */}
          <h2 className="font-instrument-sans font-semibold tracking-tight text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] mb-4">
            <span className="overflow-hidden inline-block py-1 mr-3">
              <motion.span
                className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
                initial={{
                  y: shouldReduceMotion ? 0 : '110%',
                  opacity: shouldReduceMotion ? 0 : 1,
                  filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)',
                }}
                animate={
                  isHeaderInView
                    ? { y: 0, opacity: 1, filter: 'blur(0px)' }
                    : {
                        y: shouldReduceMotion ? 0 : '110%',
                        opacity: shouldReduceMotion ? 0 : 1,
                        filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)',
                      }
                }
                transition={{ duration: 0.7, ease: BASE_EASE }}
              >
                {titleWords[0]} {titleWords[1]}
              </motion.span>
            </span>
            <span className="overflow-hidden inline-block py-1">
              <motion.span
                className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
                initial={{
                  y: shouldReduceMotion ? 0 : '110%',
                  opacity: shouldReduceMotion ? 0 : 1,
                  filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)',
                }}
                animate={
                  isHeaderInView
                    ? { y: 0, opacity: 1, filter: 'blur(0px)' }
                    : {
                        y: shouldReduceMotion ? 0 : '110%',
                        opacity: shouldReduceMotion ? 0 : 1,
                        filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)',
                      }
                }
                transition={{ duration: 0.7, delay: 0.08, ease: BASE_EASE }}
              >
                {titleWords[2]}
              </motion.span>
            </span>
          </h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
            animate={
              isHeaderInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: shouldReduceMotion ? 0 : 14 }
            }
            transition={{ duration: 0.6, delay: 0.16, ease: BASE_EASE }}
            className="text-white/75 max-w-xl mx-auto leading-[1.65] text-base lg:text-lg"
          >
            {experienceData.subtitle}
          </motion.p>
        </div>

        {/* Experience List with Journey Spine */}
        <div ref={listRef} className="relative space-y-16 lg:space-y-28">
          {/* Continuous Journey Spine Line */}
          <JourneySpine
            listRef={listRef}
            activeRowIds={{}}
            roles={experienceData.roles}
            rowRefs={[]}
          />

          {/* Experience Rows */}
          {experienceData.roles.map((role, idx) => (
            <ExperienceRow key={role.id} item={role} rowIndex={idx} />
          ))}

          {/* Closing Pill under the last row */}
          <SpineClosingPill />
        </div>
      </div>
    </section>
  );
};
