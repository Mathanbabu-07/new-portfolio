import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MapPin, Building2 } from 'lucide-react';
import type { ExperienceItem } from '../../data/experience';

interface DetailsCardProps {
  item: ExperienceItem;
  isInView: boolean;
  slideDirection: 'left' | 'right'; // 'left' means card is on left of spine (slides from -24)
  className?: string;
}

const BASE_EASE = [0.22, 1, 0.36, 1] as const;

export const DetailsCard: React.FC<DetailsCardProps> = ({
  item,
  isInView,
  slideDirection,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        rafId.current = null;
      });
    }
  };

  const handlePointerLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const headingId = `experience-role-${item.id}`;
  const initialX = shouldReduceMotion ? 0 : slideDirection === 'left' ? -24 : 24;

  // Split role words for masked word reveal
  const roleWords = item.role.split(' ');

  return (
    <article
      ref={cardRef}
      aria-labelledby={headingId}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#070d24]/55 backdrop-blur-lg p-7 lg:p-9 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_20px_50px_rgba(0,0,0,.35)] flex flex-col justify-between select-none ${className}`}
    >
      {/* 1px top highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#3054ff]/60 to-transparent rounded-t-3xl"
      />

      {/* Faint dotted texture with radial fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none opacity-80"
        style={{
          background:
            'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px) 0 0 / 22px 22px',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 85%)',
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 85%)',
        }}
      />

      {/* Spotlight Overlay 1: Inner Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden [@media(pointer:fine)]:block motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, -9999px) var(--my, -9999px), rgba(48,84,255,.16), transparent 60%)',
        }}
      />

      {/* Spotlight Overlay 2: 1px Border Glow using mask-composite exclude */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden [@media(pointer:fine)]:block motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, -9999px) var(--my, -9999px), rgba(180,192,255,.5), transparent 70%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      />

      {/* Huge Faded Index Numeral ("01"/"02") */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-5 right-4 font-instrument-serif text-[120px] leading-none text-white/[0.05] select-none z-0"
      >
        {item.index}
      </div>

      {/* Main Content with Staggered Entrance */}
      <motion.div
        className="relative z-10 space-y-4"
        initial={{
          opacity: 0,
          x: initialX,
          filter: shouldReduceMotion ? 'blur(0px)' : 'blur(8px)',
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
              }
            : {
                opacity: 0,
                x: initialX,
                filter: shouldReduceMotion ? 'blur(0px)' : 'blur(8px)',
              }
        }
        transition={{
          duration: 0.7,
          delay: 0.2,
          ease: BASE_EASE,
        }}
      >
        {/* a) Chips Row: Status + Location */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Chip */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {item.status.live ? (
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-[#b4c0ff]/60 mr-2" />
            )}
            <span className="font-mono">{item.status.label}</span>
          </div>

          {/* Location Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <MapPin aria-hidden="true" className="w-3 h-3 text-[#b4c0ff]" />
            <span>{item.location}</span>
          </div>
        </div>

        {/* b) Role Title with Masked Word Reveal */}
        <h3
          id={headingId}
          className="font-instrument-sans font-semibold tracking-tight text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.1]"
        >
          {roleWords.map((word, wIdx) => (
            <span
              key={`word-${word}-${wIdx}`}
              className="overflow-hidden inline-block py-0.5 mr-2"
            >
              <motion.span
                className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
                initial={{
                  y: shouldReduceMotion ? 0 : '110%',
                  opacity: shouldReduceMotion ? 0 : 1,
                }}
                animate={
                  isInView
                    ? { y: 0, opacity: 1 }
                    : {
                        y: shouldReduceMotion ? 0 : '110%',
                        opacity: shouldReduceMotion ? 0 : 1,
                      }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.26 + wIdx * 0.04,
                  ease: BASE_EASE,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h3>

        {/* c) Company with Building2 Icon */}
        <div className="flex items-center gap-2 text-white/85">
          <Building2 aria-hidden="true" className="w-4 h-4 text-[#b4c0ff]" />
          <span className="font-instrument-serif italic text-xl leading-none">
            {item.company}
          </span>
        </div>

        {/* d) Description */}
        <p className="text-white/70 leading-[1.7] text-[15px] lg:text-base font-normal">
          {item.description}
        </p>

        {/* e) Tags Row */}
        <div className="pt-2 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.035] hover:bg-[#3054ff]/10 hover:border-[#3054ff]/60 px-3.5 py-1.5 text-xs lg:text-sm font-medium text-white/85 transition-all duration-200 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </article>
  );
};
