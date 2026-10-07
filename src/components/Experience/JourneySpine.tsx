import React from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { ArrowRight, Cpu, Milk, FlaskConical } from 'lucide-react';
import type { ExperienceItem } from '../../data/experience';

interface JourneySpineProps {
  listRef: React.RefObject<HTMLDivElement | null>;
  activeRowIds: Record<string, boolean>;
  roles: ExperienceItem[];
  rowRefs: React.RefObject<HTMLDivElement | null>[];
}

export const JourneyNodeIcon: React.FC<{
  iconName: ExperienceItem['nodeIcon'];
  className?: string;
}> = ({ iconName, className = 'w-5 h-5' }) => {
  if (iconName === 'Cpu') {
    return <Cpu aria-hidden="true" className={className} />;
  }
  if (iconName === 'Milk') {
    return <Milk aria-hidden="true" className={className} />;
  }
  return <FlaskConical aria-hidden="true" className={className} />;
};

export const JourneySpine: React.FC<JourneySpineProps> = ({
  listRef,
  activeRowIds,
  roles,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Scroll progress through the experience list: ["start 65%", "end 55%"]
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 65%', 'end 55%'],
  });

  // Spring-smoothed progress for 60fps tracking
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  const dotTop = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const dotOpacity = useTransform(smoothProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0.4]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-[22px] lg:left-[calc((100%-4rem)*5/12+2rem)] -translate-x-1/2 w-[1px] select-none z-10"
    >
      {/* Base Spine Line: Gradient transparent / white-15 / transparent */}
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-b from-transparent via-white/15 to-transparent" />

      {/* Progress Fill: Gradient #3054ff to #b4c0ff with soft glow */}
      <motion.div
        className="absolute inset-x-0 top-0 w-full bg-gradient-to-b from-[#3054ff] to-[#b4c0ff] shadow-[0_0_12px_rgba(48,84,255,0.8)]"
        style={{
          height: '100%',
          transformOrigin: 'top',
          scaleY: shouldReduceMotion ? 1 : smoothProgress,
        }}
      />

      {/* 8px Glowing Head Dot following the fill end */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#b4c0ff] shadow-[0_0_10px_#3054ff,0_0_20px_#b4c0ff]"
          style={{
            top: dotTop,
            opacity: dotOpacity,
          }}
        />
      )}

      {/* Node Indicators positioned at row heights */}
      {roles.map((role, idx) => {
        const isIgnited = !!activeRowIds[role.id];

        return (
          <div
            key={`spine-node-${role.id}`}
            style={{
              top: `${idx === 0 ? '25%' : '75%'}`,
            }}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 hidden"
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
              transition={{ duration: 0.4 }}
              className={`w-11 h-11 rounded-full bg-[#070d24] border flex items-center justify-center transition-shadow duration-300 ${
                isIgnited
                  ? 'border-[#3054ff] text-[#b4c0ff] shadow-[0_0_0_6px_rgba(48,84,255,0.15),0_0_30px_rgba(48,84,255,0.6)]'
                  : 'border-white/15 text-white/60'
              }`}
            >
              <JourneyNodeIcon iconName={role.nodeIcon} className="w-5 h-5" />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export const SpineClosingPill: React.FC = () => {
  return (
    <div className="relative z-20 mt-16 flex flex-col items-center justify-center">
      <a
        href="#contact"
        className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm text-xs font-medium text-white/80 hover:text-white hover:border-[#3054ff]/60 hover:bg-[#3054ff]/10 hover:shadow-[0_0_20px_rgba(48,84,255,0.4)] transition-all duration-200"
      >
        <span>Open to new opportunities</span>
        <ArrowRight
          aria-hidden="true"
          className="w-3.5 h-3.5 text-[#b4c0ff] group-hover:translate-x-0.5 transition-transform duration-200"
        />
      </a>
    </div>
  );
};
