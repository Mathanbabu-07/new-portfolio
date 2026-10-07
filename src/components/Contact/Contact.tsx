import React, { useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { channelTiles } from '../../data/contact';
import { TalkCard } from './TalkCard';
import { TnMap } from './TnMap';
import { ChannelTile } from './ChannelTile';
import { Toast } from './Toast';

export const Contact: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  const handleCopied = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const emailChannel = channelTiles.find((c) => c.id === 'email')!;
  const phoneChannel = channelTiles.find((c) => c.id === 'phone')!;
  const linkedinChannel = channelTiles.find((c) => c.id === 'linkedin')!;
  const githubChannel = channelTiles.find((c) => c.id === 'github')!;
  const instagramChannel = channelTiles.find((c) => c.id === 'instagram')!;

  const fadeUpVariant = (delay: number) => ({
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
      filter: shouldReduceMotion ? 'none' : 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  });

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact Mathan Babu S"
      className="relative scroll-mt-24 py-24 lg:py-32 bg-black text-white [overflow-x:clip]"
    >
      {/* 
        Ambience layers:
        1. Curtain hairlines with radial mask
        2. Horizon radial glow rising from the bottom (fading to 0 well inside its box)
        NO box-shadow glows, NO blur-* blobs, NO rectangular masks
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 select-none overflow-visible"
      >
        {/* Faint curtain hairlines */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(48,84,255,.05) 0 1px, transparent 1px 72px)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,1) 0%, transparent 80%)',
            maskImage:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,1) 0%, transparent 80%)',
          }}
        />

        {/* Horizon radial glow rising from the bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-[600px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(48,84,255,.20) 0%, transparent 80%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 flex flex-col gap-5">
        {/* Row A: TalkCard (col-span-7) + TnMap (col-span-5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <motion.div
            variants={fadeUpVariant(0.05)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:col-span-7 flex flex-col"
          >
            <TalkCard />
          </motion.div>

          <motion.div
            variants={fadeUpVariant(0.12)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:col-span-5 flex flex-col w-full max-w-[340px] mx-auto lg:max-w-none"
          >
            <TnMap />
          </motion.div>
        </div>

        {/* Row B1: Email (col-span-6) + Phone (col-span-6) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
          <motion.div
            variants={fadeUpVariant(0.19)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:col-span-6"
          >
            <ChannelTile channel={emailChannel} onCopied={handleCopied} />
          </motion.div>

          <motion.div
            variants={fadeUpVariant(0.26)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:col-span-6"
          >
            <ChannelTile channel={phoneChannel} onCopied={handleCopied} />
          </motion.div>
        </div>

        {/* Row B2: LinkedIn (col-span-4) + GitHub (col-span-4) + Instagram (col-span-4) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-5 items-stretch">
          <motion.div
            variants={fadeUpVariant(0.33)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:col-span-4"
          >
            <ChannelTile channel={linkedinChannel} onCopied={handleCopied} />
          </motion.div>

          <motion.div
            variants={fadeUpVariant(0.40)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:col-span-4"
          >
            <ChannelTile channel={githubChannel} onCopied={handleCopied} />
          </motion.div>

          <motion.div
            variants={fadeUpVariant(0.47)}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:col-span-4"
          >
            <ChannelTile channel={instagramChannel} onCopied={handleCopied} />
          </motion.div>
        </div>
      </div>

      {/* Global Copy Toast */}
      <Toast message={toastMessage} />
    </section>
  );
};
