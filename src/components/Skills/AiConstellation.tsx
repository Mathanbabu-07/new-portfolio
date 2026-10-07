import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BrainCircuit } from 'lucide-react';
import { SkillTile } from './SkillTile';
import { EASE_CUSTOM } from './motionVariants';

interface AiConstellationProps {
  skills: readonly string[];
  isInView: boolean;
}

interface NodeConfig {
  name: string;
  xPct: number; // percentage in container (0-100)
  yPct: number;
  svgX: number; // in 160x110 viewBox
  svgY: number;
}

// 5 nodes matching exact positions from spec:
// core (50,50) -> svg (80, 55)
// Agentic AI (50,14) -> svg (80, 15.4)
// Context Engineering (82,38) -> svg (131.2, 41.8)
// Vibe Coding (70,80) -> svg (112, 88)
// Automations (30,80) -> svg (48, 88)
// API Integrations (18,38) -> svg (28.8, 41.8)
const NODE_CONFIGS: NodeConfig[] = [
  {
    name: 'Agentic AI',
    xPct: 50,
    yPct: 14,
    svgX: 80,
    svgY: 15.4,
  },
  {
    name: 'Context Engineering',
    xPct: 82,
    yPct: 38,
    svgX: 131.2,
    svgY: 41.8,
  },
  {
    name: 'Vibe Coding',
    xPct: 70,
    yPct: 80,
    svgX: 112,
    svgY: 88,
  },
  {
    name: 'Automations',
    xPct: 30,
    yPct: 80,
    svgX: 48,
    svgY: 88,
  },
  {
    name: 'API Integrations',
    xPct: 18,
    yPct: 38,
    svgX: 28.8,
    svgY: 41.8,
  },
];

const CORE_SVG_X = 80;
const CORE_SVG_Y = 55;

export const AiConstellation: React.FC<AiConstellationProps> = ({
  skills: _skills,
  isInView,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);
  const [showPulses, setShowPulses] = useState(false);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const checkLg = () => {
      setIsLg(window.innerWidth >= 1024);
    };
    checkLg();
    window.addEventListener('resize', checkLg);
    return () => window.removeEventListener('resize', checkLg);
  }, []);

  // Delay pulse dots until spokes finish drawing (~1.4s)
  useEffect(() => {
    if (isInView && !shouldReduceMotion) {
      const timer = setTimeout(() => setShowPulses(true), 1400);
      return () => {
        clearTimeout(timer);
        setShowPulses(false);
      };
    }
  }, [isInView, shouldReduceMotion]);

  // Pentagon connecting the 5 outer nodes in sequence
  const pentagonPath = `M ${NODE_CONFIGS.map((n) => `${n.svgX} ${n.svgY}`).join(' L ')} Z`;

  return (
    <div className="w-full">
      {/* Keyframe animation for pulse rings */}
      <style>{`
        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.9);
            opacity: 0;
          }
        }
      `}</style>

      {/* Constellation Container: lg and up has aspect-[16/11] */}
      <div className="relative w-full lg:mt-4 lg:aspect-[16/11]">
        {/* SVG Spoke Canvas (hidden on mobile, visible lg and up) */}
        <svg
          viewBox="0 0 160 110"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full select-none overflow-visible lg:block"
        >
          <defs>
            {NODE_CONFIGS.map((node, i) => (
              <linearGradient
                key={`grad-${node.name}`}
                id={`spoke-grad-${i}`}
                x1={CORE_SVG_X}
                y1={CORE_SVG_Y}
                x2={node.svgX}
                y2={node.svgY}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#3054ff" />
                <stop offset="100%" stopColor="#b4c0ff" />
              </linearGradient>
            ))}
          </defs>

          {/* Faint dashed pentagon between the nodes */}
          <path
            d={pentagonPath}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="0.8"
            strokeDasharray="2.5 2"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {/* 5 Spokes core to node */}
          {NODE_CONFIGS.map((node, i) => {
            const spokePath = `M ${CORE_SVG_X} ${CORE_SVG_Y} L ${node.svgX} ${node.svgY}`;
            const isHovered = activeHoverIndex === i;
            const isAnyHovered = activeHoverIndex !== null;
            const targetOpacity = isHovered ? 1 : isAnyHovered ? 0.15 : 0.55;

            return (
              <g key={`spoke-group-${node.name}`}>
                <motion.path
                  id={`spoke-path-${i}`}
                  d={spokePath}
                  stroke={`url(#spoke-grad-${i})`}
                  strokeWidth="1.25"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  initial={{
                    pathLength: shouldReduceMotion ? 1 : 0,
                    opacity: 0.55,
                  }}
                  animate={
                    isInView
                      ? {
                          pathLength: 1,
                          opacity: targetOpacity,
                        }
                      : {
                          pathLength: shouldReduceMotion ? 1 : 0,
                          opacity: 0.55,
                        }
                  }
                  transition={{
                    pathLength: {
                      duration: 1.1,
                      delay: 0.3 + i * 0.1,
                      ease: EASE_CUSTOM,
                    },
                    opacity: { duration: 0.25 },
                  }}
                />

                {/* Light pulses: small #b4c0ff dot travelling along spoke with SVG animateMotion */}
                {isInView && !shouldReduceMotion && showPulses && (
                  <circle r="1.5" fill="#b4c0ff" opacity="0.95">
                    <animateMotion
                      dur="3.2s"
                      repeatCount="indefinite"
                      begin={`${i * 0.64}s`}
                      keyPoints="0;1"
                      keyTimes="0;1"
                    >
                      <mpath href={`#spoke-path-${i}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Core 64px Glass Orb (hidden on mobile, visible lg and up) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex items-center justify-center select-none z-10"
        >
          {/* Expanding pulse ring 1 */}
          {isInView && !shouldReduceMotion && (
            <div
              className="absolute -inset-1 rounded-full border border-[#3054ff]/60 pointer-events-none"
              style={{
                animation: 'pulseRing 3s cubic-bezier(0, 0, 0.2, 1) infinite',
              }}
            />
          )}

          {/* Expanding pulse ring 2 (staggered by 1.5s) */}
          {isInView && !shouldReduceMotion && (
            <div
              className="absolute -inset-1 rounded-full border border-[#3054ff]/60 pointer-events-none"
              style={{
                animation:
                  'pulseRing 3s cubic-bezier(0, 0, 0.2, 1) 1.5s infinite',
              }}
            />
          )}

          {/* Core 64px Orb Body */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-[#3054ff]/25 backdrop-blur-md shadow-[0_0_32px_rgba(48,84,255,0.45),inset_0_1px_0_rgba(255,255,255,0.4)]">
            <BrainCircuit className="h-7 w-7 text-[#b4c0ff]" />
          </div>
        </div>

        {/* 
          HTML <li> tiles list
          On lg: absolutely placed based on % coordinates
          Below lg: grid grid-cols-2 gap-2.5 normal tiles
        */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 lg:absolute lg:inset-0 lg:block lg:pointer-events-none"
        >
          {NODE_CONFIGS.map((node, i) => (
            <SkillTile
              key={node.name}
              name={node.name}
              onMouseEnter={() => setActiveHoverIndex(i)}
              onMouseLeave={() => setActiveHoverIndex(null)}
              onFocus={() => setActiveHoverIndex(i)}
              onBlur={() => setActiveHoverIndex(null)}
              style={
                isLg
                  ? { left: `${node.xPct}%`, top: `${node.yPct}%` }
                  : undefined
              }
              className={
                isLg
                  ? 'absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto whitespace-nowrap shadow-lg'
                  : 'pointer-events-auto'
              }
              iconClassName="text-[#b4c0ff]"
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
