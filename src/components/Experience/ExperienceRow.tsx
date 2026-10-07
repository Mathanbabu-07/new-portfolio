import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { ExperienceItem } from '../../data/experience';
import { PhotoFrame } from './PhotoFrame';
import { DetailsCard } from './DetailsCard';
import { JourneyNodeIcon } from './JourneySpine';

interface ExperienceRowProps {
  item: ExperienceItem;
  rowIndex: number;
}

const BASE_EASE = [0.22, 1, 0.36, 1] as const;

export const ExperienceRow: React.FC<ExperienceRowProps> = ({
  item,
  rowIndex: _rowIndex,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Entrance motion triggered once when row is 20% inside viewport
  const isEntered = useInView(rowRef, {
    once: true,
    margin: '0px 0px -20% 0px',
  });

  // Node ignites when the row center crosses viewport center
  const isIgnited = useInView(rowRef, {
    margin: '-45% 0px -45% 0px',
  });

  const isDetailsLeft = item.layout === 'details-left';

  return (
    <div
      ref={rowRef}
      className="relative pl-12 lg:pl-0 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-y-8 lg:gap-x-16 items-center"
    >
      {/* 
        Journey Node: 44px circle sitting directly on the spine
        - Mobile: top-0, left-[22px], -translate-x-1/2
        - Desktop: top-1/2, left-[calc((100%-4rem)*5/12+2rem)], -translate-x-1/2 -translate-y-1/2
      */}
      <div
        aria-hidden="true"
        className="absolute left-[22px] lg:left-[calc((100%-4rem)*5/12+2rem)] top-0 lg:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 z-20 select-none pointer-events-none"
      >
        <motion.div
          animate={
            isIgnited
              ? {
                  scale: shouldReduceMotion ? 1 : [1, 1.25, 1],
                  borderColor: '#3054ff',
                  color: '#b4c0ff',
                }
              : {
                  scale: 1,
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'rgba(255, 255, 255, 0.6)',
                }
          }
          transition={{ duration: 0.4, ease: BASE_EASE }}
          className={`w-11 h-11 rounded-full bg-[#070d24] border flex items-center justify-center transition-all duration-300 ${
            isIgnited
              ? 'border-[#3054ff] text-[#b4c0ff] shadow-[0_0_0_6px_rgba(48,84,255,0.15),0_0_30px_rgba(48,84,255,0.6)]'
              : 'border-white/15 text-white/60'
          }`}
        >
          <JourneyNodeIcon iconName={item.nodeIcon} className="w-5 h-5" />
        </motion.div>
      </div>

      {/* 
        DOM Order: [PhotoFrame, DetailsCard]
        Row 1 (details-left): Photo has lg:order-2, Details has lg:order-1
        Row 2 (photo-left):   Photo has lg:order-1, Details has lg:order-2
        Mobile (<1024px):    Photo is order-1, Details is order-2
      */}

      {/* 1. Photo Frame */}
      <motion.div
        className={`w-full order-1 ${isDetailsLeft ? 'lg:order-2' : 'lg:order-1'}`}
        initial={{
          opacity: 0,
          y: shouldReduceMotion ? 0 : 24,
        }}
        animate={
          isEntered
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: shouldReduceMotion ? 0 : 24 }
        }
        transition={{
          duration: 0.6,
          ease: BASE_EASE,
        }}
      >
        <PhotoFrame photo={item.photo} isInView={isEntered} />
      </motion.div>

      {/* 2. Details Card */}
      <div
        className={`w-full order-2 ${isDetailsLeft ? 'lg:order-1' : 'lg:order-2'}`}
      >
        <DetailsCard
          item={item}
          isInView={isEntered}
          slideDirection={isDetailsLeft ? 'left' : 'right'}
        />
      </div>
    </div>
  );
};
