import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight, Download, MapPin } from 'lucide-react';
import { contactData } from '../../data/contact';
import { MagneticButton } from '../MagneticButton';
import { LocalTime } from './LocalTime';

export const TalkCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.15 });
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
    const el = cardRef.current;
    if (el) {
      el.style.setProperty('--mx', '-9999px');
      el.style.setProperty('--my', '-9999px');
    }
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#070d24]/55 backdrop-blur-lg p-7 lg:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_20px_50px_rgba(0,0,0,.35)] select-none"
    >
      {/* 1px top highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#3054ff]/60 to-transparent rounded-t-3xl"
      />

      {/* Dotted background texture with radial fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none opacity-60"
        style={{
          background:
            'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px) 0 0 / 22px 22px',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 85%)',
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 85%)',
        }}
      />

      {/* Cursor spotlight inner radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden [@media(pointer:fine)]:block motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(460px circle at var(--mx, -9999px) var(--my, -9999px), rgba(48,84,255,.18), transparent 65%)',
        }}
      />

      {/* Top Section: Badges & Heading */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Label & Opportunities Chip */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3054ff] shadow-[0_0_8px_#3054ff]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#b4c0ff] font-medium">
              {contactData.copy.label}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>{contactData.copy.chip}</span>
          </div>
        </div>

        {/* H2 Heading with Masked Word Reveal */}
        <h2 className="font-instrument-sans font-semibold tracking-tight text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.02] text-white">
          <span className="overflow-hidden inline-block py-0.5">
            <motion.span
              initial={{ y: '110%', filter: shouldReduceMotion ? 'none' : 'blur(8px)' }}
              animate={isInView ? { y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
            >
              Let's build something&nbsp;
            </motion.span>
          </span>
          <span className="overflow-hidden inline-block py-0.5">
            <motion.span
              initial={{ y: '110%', filter: shouldReduceMotion ? 'none' : 'blur(8px)' }}
              animate={isInView ? { y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block font-instrument-serif italic font-normal text-[#b4c0ff]"
            >
              impactful&nbsp;
            </motion.span>
          </span>
          <span className="overflow-hidden inline-block py-0.5">
            <motion.span
              initial={{ y: '110%', filter: shouldReduceMotion ? 'none' : 'blur(8px)' }}
              animate={isInView ? { y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
            >
              together.
            </motion.span>
          </span>
        </h2>

        {/* Subtitle */}
        <p className="font-instrument-sans text-base sm:text-lg text-white/70 max-w-md leading-relaxed">
          {contactData.copy.subtitle}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          {/* Primary CTA (MagneticButton) */}
          <MagneticButton className="w-full sm:w-auto">
            <a
              href={contactData.emailCtaHref}
              className="pl-6 pr-2 py-2 rounded-full bg-white flex items-center justify-between sm:justify-start gap-4 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer group w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="font-instrument-sans font-medium text-base sm:text-lg text-[#0a0400]">
                Send an Email
              </span>
              <div className="w-10 h-10 rounded-full bg-[#3054ff] group-hover:bg-[#2040e0] flex items-center justify-center transition-colors flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </a>
          </MagneticButton>

          {/* Download Resume Ghost CTA */}
          <a
            href={contactData.resume.href}
            download={contactData.resume.downloadName}
            className="group px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2.5 font-instrument-sans text-sm sm:text-base transition-all duration-200 cursor-pointer w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Download className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
            <span>Download Resume</span>
          </a>
        </div>
      </div>

      {/* Bottom Row Divider & Metadata */}
      <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-mono text-white/60">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#3054ff] shrink-0" />
          <span>{contactData.location.label}, {contactData.location.country}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3054ff] shadow-[0_0_6px_#3054ff]" />
          <LocalTime />
        </div>
      </div>
    </article>
  );
};
