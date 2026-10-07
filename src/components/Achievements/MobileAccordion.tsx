import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown, Award, Trophy, Medal } from 'lucide-react';
import { achievements } from '../../data/achievements';

export const MobileAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (idx: number) => {
    const nextIdx = openIndex === idx ? -1 : idx;
    setOpenIndex(nextIdx);

    if (nextIdx !== -1) {
      setTimeout(() => {
        const el = cardRefs.current[nextIdx];
        if (el) {
          const top = window.scrollY + el.getBoundingClientRect().top - 96;
          window.scrollTo({
            top,
            behavior: shouldReduceMotion ? 'instant' : 'smooth',
          });
        }
      }, 100);
    }
  };

  const handlePanEnd = (
    idx: number,
    _: any,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (Math.abs(info.offset.x) > 40 || Math.abs(info.velocity.x) > 300) {
      if (info.offset.x < 0 || info.velocity.x < -300) {
        // Swiped left -> next card
        const next = Math.min(4, idx + 1);
        handleToggle(next);
      } else {
        // Swiped right -> prev card
        const prev = Math.max(0, idx - 1);
        handleToggle(prev);
      }
    }
  };

  const renderIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className={className} aria-hidden="true" />;
      case 'Medal':
        return <Medal className={className} aria-hidden="true" />;
      case 'Award':
      default:
        return <Award className={className} aria-hidden="true" />;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3 px-4 select-none touch-pan-y">
      {achievements.map((item, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={item.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#070d24]/90 shadow-md transition-colors"
          >
            {/* Accordion Header / Closed View */}
            <button
              type="button"
              onClick={() => handleToggle(idx)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              className="relative flex h-[76px] w-full items-center justify-between overflow-hidden px-4 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff]"
            >
              {/* Closed background image slice with focusX positioning */}
              {!isOpen && (
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                  <img
                    src={`${item.image}-620.webp`}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover opacity-35"
                    style={{
                      objectPosition: `${item.focusX * 100}% 50%`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
                </div>
              )}

              {/* Title & Index */}
              <div className="flex items-center gap-3 z-10">
                <span className="font-mono text-xs font-semibold text-[#b4c0ff]/70">
                  0{idx + 1}
                </span>
                <span className="font-instrument-sans text-base font-semibold tracking-tight text-white/95">
                  {item.shortTitle}
                </span>
              </div>

              {/* Chevron */}
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] text-white/70"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            {/* Accordion Expanded Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1, height: 'auto' }
                      : { opacity: 0, height: 0 }
                  }
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, height: 0 }
                      : { opacity: 0, height: 0 }
                  }
                  transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  onPanEnd={(_, info) => handlePanEnd(idx, _, info)}
                  className="touch-pan-y"
                >
                  <div className="p-3 pt-0">
                    {/* Full aspect 1.55 photo */}
                    <div className="relative aspect-[1.55/1] w-full overflow-hidden rounded-xl border border-white/10 bg-[#050a1c]">
                      <img
                        src={`${item.image}-1240.webp`}
                        srcSet={`${item.image}-620.webp 620w, ${item.image}-1240.webp 1240w`}
                        sizes="92vw"
                        alt={item.alt}
                        className="h-full w-full object-cover block select-none pointer-events-none"
                      />
                    </div>

                    {/* Content Block */}
                    <div className="flex flex-col gap-2.5 pt-4 px-2 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#b4c0ff]">
                          {renderIcon(item.icon, 'w-4 h-4')}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.badges.map((b) => (
                            <span
                              key={b}
                              className="rounded-full border border-[#3054ff]/40 bg-[#3054ff]/20 px-2.5 py-0.5 text-[11px] font-medium text-[#b4c0ff]"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h3 className="font-instrument-sans text-xl font-semibold tracking-tight text-white leading-snug">
                        {item.title}
                      </h3>

                      <p className="font-instrument-serif italic text-base text-white/80">
                        {item.org}
                      </p>

                      <p className="font-instrument-sans text-sm text-white/70 leading-relaxed pt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
