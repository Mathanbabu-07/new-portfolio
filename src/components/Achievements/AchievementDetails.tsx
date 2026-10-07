import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Trophy, Medal } from 'lucide-react';
import type { Achievement } from '../../data/achievements';

interface AchievementDetailsProps {
  item: Achievement;
  index: number;
  direction: number; // +1 forward, -1 backward
}

export const AchievementDetails: React.FC<AchievementDetailsProps> = ({
  item,
  index,
  direction,
}) => {
  const actualDirection = direction >= 0 ? 1 : -1;

  const renderIcon = (className = 'w-4 h-4') => {
    switch (item.icon) {
      case 'Trophy':
        return <Trophy className={className} aria-hidden="true" />;
      case 'Medal':
        return <Medal className={className} aria-hidden="true" />;
      case 'Award':
      default:
        return <Award className={className} aria-hidden="true" />;
    }
  };

  const containerVariants = {
    initial: {
      opacity: 0,
      x: actualDirection * 24,
      filter: 'blur(6px)',
    },
    animate: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: 0.06,
      },
    },
    exit: {
      opacity: 0,
      x: -actualDirection * 24,
      filter: 'blur(6px)',
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const badgeVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div
      aria-live="polite"
      className="relative w-full rounded-3xl border border-white/10 bg-[#070d24]/55 p-6 lg:p-7 backdrop-blur-lg shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_20px_50px_rgba(0,0,0,.45)] min-h-[190px] overflow-hidden select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:items-start"
        >
          {/* Left Column: Index/Icon, Title, Org, Badges */}
          <div className="flex flex-col gap-2">
            {/* Top row: 01 / 05 + Icon */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold tracking-wider text-[#b4c0ff]/70">
                0{index + 1} / 05
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#b4c0ff]">
                {renderIcon('w-4 h-4')}
              </div>
            </motion.div>

            {/* Title (Instrument Sans semibold tracking-tight gradient) */}
            <motion.h3
              variants={itemVariants}
              className="font-instrument-sans font-semibold tracking-tight text-[clamp(1.4rem,2.3vw,2rem)] leading-[1.1] bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
            >
              {item.title}
            </motion.h3>

            {/* Org (Instrument Serif italic) */}
            <motion.p
              variants={itemVariants}
              className="font-instrument-serif italic text-lg text-white/80"
            >
              {item.org}
            </motion.p>

            {/* Badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 pt-1"
            >
              {item.badges.map((badge, bIdx) => (
                <motion.span
                  key={badge}
                  variants={badgeVariants}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-tight border ${
                    bIdx === 0
                      ? 'border-[#3054ff]/40 bg-[#3054ff]/20 text-[#b4c0ff]'
                      : 'border-white/10 bg-white/[0.04] text-white/70'
                  }`}
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Description */}
          <motion.div variants={itemVariants} className="lg:pt-2">
            <p className="font-instrument-sans text-[15px] leading-[1.7] text-white/70">
              {item.desc}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
