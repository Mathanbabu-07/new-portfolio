import { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { profile } from '../data/portfolio';
import { RotatingRole } from './RotatingRole';
import { MagneticButton } from './MagneticButton';

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [showScrollCue, setShowScrollCue] = useState(true);

  // Parallax scroll-out effect for the content block (video stays pinned)
  const { scrollY, scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(heroProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.2]);
  const contentScale = useTransform(heroProgress, [0, 1], [1, 0.98]);

  // Fade out scroll cue on scroll > 80px
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setShowScrollCue(latest <= 80);
  });

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative w-full min-h-[100svh] text-white flex items-center justify-center"
    >


      {/* 2. Main Hero Content Container */}
      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : contentY,
          opacity: shouldReduceMotion ? 1 : contentOpacity,
          scale: shouldReduceMotion ? 1 : contentScale,
        }}
        className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-28 pb-16 flex flex-col items-center text-center space-y-6 sm:space-y-8"
      >
        {/* Element 1: Status Chip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{profile.status}</span>
        </motion.div>

        {/* Element 2: Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-instrument-serif text-3xl sm:text-5xl lg:text-[48px] leading-[1.1] text-white tracking-normal"
        >
          {profile.greeting}
        </motion.p>

        {/* Element 3: Name with Masked Word Reveal & Shimmer */}
        <motion.h1
          initial={{ scale: shouldReduceMotion ? 1 : 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative font-instrument-sans font-semibold uppercase tracking-tighter leading-[0.9] text-[clamp(2.75rem,10vw,7.5rem)] select-none text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center md:gap-x-4 lg:gap-x-6">
            {/* Word 1: MATHAN */}
            <span className="overflow-hidden inline-block py-1">
              <motion.span
                initial={{ y: '110%', filter: 'blur(10px)' }}
                animate={{ y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
              >
                {profile.name[0]}
              </motion.span>
            </span>

            {/* Words 2 & 3: BABU S (kept grouped on mobile to prevent orphaned 'S') */}
            <span className="overflow-hidden inline-block whitespace-nowrap py-1">
              <motion.span
                initial={{ y: '110%', filter: 'blur(10px)' }}
                animate={{ y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, delay: 0.33, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
              >
                {profile.name[1]} {profile.name[2]}
              </motion.span>
            </span>
          </div>

          {/* Name Shimmer: one-time light sweep across the name after reveal */}
          {!shouldReduceMotion && (
            <motion.span
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '200%', opacity: [0, 0.45, 0] }}
              transition={{ duration: 1.2, delay: 1.4, ease: 'easeInOut' }}
              className="pointer-events-none absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12"
            />
          )}
        </motion.h1>

        {/* Element 4: Looping Role Line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="pt-1"
        >
          <RotatingRole roles={profile.roles} rolePrefix={profile.rolePrefix} />
        </motion.div>

        {/* Element 5: Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="font-instrument-sans text-base sm:text-lg lg:text-[20px] leading-[1.65] text-white/70 max-w-2xl mx-auto font-normal px-2"
        >
          Turning ideas into impactful digital solutions through{' '}
          <span className="text-white">full-stack web development</span>,{' '}
          <span className="text-white">data analytics and visualization</span>,{' '}
          <span className="text-white">MVP development</span>, and{' '}
          <span className="text-white">creative design</span>—helping individuals, startups, and
          businesses transform concepts into real-world results.
        </motion.p>

        {/* Element 6: CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center pt-2 w-full sm:w-auto"
        >
          {/* Primary CTA (Wrapped in MagneticButton) */}
          <MagneticButton className="w-full sm:w-auto flex justify-center">
            <a
              href={profile.primaryCta.href}
              className="pl-6 pr-2 py-2 rounded-full bg-white flex items-center justify-between sm:justify-start gap-4 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer group w-full sm:w-auto max-w-xs sm:max-w-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span className="font-instrument-sans font-medium text-lg text-[#0a0400]">
                {profile.primaryCta.label}
              </span>
              <div className="w-10 h-10 rounded-full bg-[#3054ff] group-hover:bg-[#2040e0] flex items-center justify-center transition-colors flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-white transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </a>
          </MagneticButton>

          {/* Secondary Ghost CTA */}
          <a
            href={profile.secondaryCta.href}
            className="group px-4 py-2.5 rounded-lg backdrop-blur-sm hover:bg-white/5 text-white/70 hover:text-white flex items-center justify-center gap-2 font-instrument-sans text-base transition-colors duration-200 cursor-pointer w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>{profile.secondaryCta.label}</span>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
          </a>
        </motion.div>
      </motion.div>

      {/* Element 7: Scroll Cue Indicator */}
      <AnimatePresence>
        {showScrollCue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 pointer-events-none max-h-[640px]:hidden select-none z-10"
          >
            <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1.5 shadow-[0_0_12px_rgba(255,255,255,0.1)]">
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="w-1 h-1.5 rounded-full bg-white/70"
              />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
              Scroll
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
