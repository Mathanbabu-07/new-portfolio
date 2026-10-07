import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'motion/react';
import { achievements } from '../../data/achievements';
import {
  SLAT_CONSTANTS,
  computeSlatDimensions,
  getSlatOpen,
  getSlatWidth,
} from './slatMath';
import { Slat } from './Slat';
import { AchievementDetails } from './AchievementDetails';
import { SlatRail } from './SlatRail';
import { useScrollTo } from './useScrollTo';

export const CurtainStage: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({
    W: 1152,
    stageH: 800,
    Hs: 380,
    Wo: 589,
    Wc: 105,
    g: 12,
  });

  // Measure stage dimensions on mount and resize
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => {
      const w = Math.min(1152, el.clientWidth || 1152);
      const h = window.innerHeight || 800;
      setDimensions(computeSlatDimensions(w, h));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // 1. Scroll-linked progress across pinned track (calc(100svh + 300vh))
  const { scrollYProgress: pinProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // 10 keyframes over pin: [0,.12,.22,.34,.44,.56,.66,.78,.88,1] -> [0,0,1,1,2,2,3,3,4,4]
  const tRaw = useTransform(
    pinProgress,
    [0, 0.12, 0.22, 0.34, 0.44, 0.56, 0.66, 0.78, 0.88, 1],
    [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]
  );

  const t = useSpring(tRaw, { stiffness: 120, damping: 24, mass: 0.6 });

  // Active index state with 60ms debounce for text change
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hasMoved, setHasMoved] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);

  useMotionValueEvent(t, 'change', (latest) => {
    const rounded = Math.max(0, Math.min(4, Math.round(latest)));
    if (!hasMoved && latest > 0.05) {
      setHasMoved(true);
    }

    if (rounded !== activeIndex) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(() => {
        setDirection(rounded >= activeIndex ? 1 : -1);
        setActiveIndex(rounded);
      }, 60);
    }
  });

  // Programmatic scroll-to spring helper
  const { scrollTo } = useScrollTo();

  // Scroll to achievement i
  const navigateToAchievement = useCallback(
    (index: number, velocity = 0) => {
      setHasMoved(true);
      const track = trackRef.current;
      if (!track) return;

      const trackRect = track.getBoundingClientRect();
      const trackTop = window.scrollY + trackRect.top;
      const D = track.offsetHeight - window.innerHeight;
      const targetP = SLAT_CONSTANTS.REST_CENTRES[index];
      const targetY = trackTop + targetP * D;

      scrollTo(targetY, velocity);
    },
    [scrollTo]
  );

  // Keyboard navigation on slats (Left/Right arrow keys)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min(4, index + 1);
        navigateToAchievement(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(0, index - 1);
        navigateToAchievement(prev);
      }
    },
    [navigateToAchievement]
  );

  // 2. Drag / Pan Gesture handling on stage
  const panStartScrollYRef = useRef(0);

  const handlePanStart = () => {
    setHasMoved(true);
    panStartScrollYRef.current = window.scrollY;
  };

  const handlePan = (_: any, info: { offset: { x: number } }) => {
    const track = trackRef.current;
    if (!track) return;

    const D = track.offsetHeight - window.innerHeight;
    const W = dimensions.W;
    // K = (0.22*D)/(0.30*W) scroll px per drag px
    const K = (0.22 * D) / (0.3 * W);

    const targetScroll = panStartScrollYRef.current - info.offset.x * K;
    window.scrollTo({ top: targetScroll, behavior: 'instant' });
  };

  const handlePanEnd = (_: any, info: { velocity: { x: number } }) => {
    const track = trackRef.current;
    if (!track) return;

    const D = track.offsetHeight - window.innerHeight;
    const W = dimensions.W;
    const K = (0.22 * D) / (0.3 * W);

    // v = -velocity.x * K; target = nearest rest scrollY to (scrollY + v*0.25), at most 2 steps away
    const v = -info.velocity.x * K;
    const projectedY = window.scrollY + v * 0.25;

    const trackRect = track.getBoundingClientRect();
    const trackTop = window.scrollY + trackRect.top;

    // Find nearest rest centre
    let bestIdx = 0;
    let minDiff = Infinity;
    SLAT_CONSTANTS.REST_CENTRES.forEach((rp, idx) => {
      const restY = trackTop + rp * D;
      const diff = Math.abs(restY - projectedY);
      if (diff < minDiff) {
        minDiff = diff;
        bestIdx = idx;
      }
    });

    // Clamp to at most 2 steps away from current activeIndex
    const clampedIdx = Math.max(
      Math.max(0, activeIndex - 2),
      Math.min(Math.min(4, activeIndex + 2), bestIdx)
    );

    navigateToAchievement(clampedIdx, v);
  };

  // 3. Stage Ambience: Glow position following the open slat center
  const glowX = useTransform(t, (latestT) => {
    const { Wo, Wc, g } = dimensions;
    let sumWeights = 0;
    let weightedCenter = 0;
    let curLeft = 0;

    for (let i = 0; i < 5; i++) {
      const open_i = getSlatOpen(i, latestT);
      const w_i = getSlatWidth(open_i, Wo, Wc);
      const center_i = curLeft + w_i / 2;
      weightedCenter += open_i * center_i;
      sumWeights += open_i;
      curLeft += w_i + g;
    }

    return sumWeights > 0 ? weightedCenter / sumWeights : dimensions.W / 2;
  });

  return (
    <div
      ref={trackRef}
      className="relative mt-8"
      style={{
        height: `calc(100svh + ${SLAT_CONSTANTS.STAGE_SCROLL_VH}vh)`,
      }}
    >
      {/* 
        Sticky Stage
        - Height 100svh, pinned top-0
        - Overflow-hidden on sticky stage only
      */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center items-center select-none pt-20 pb-6">
        <motion.div
          ref={stageRef}
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          className="relative mx-auto flex w-full max-w-[1152px] flex-col gap-5 px-4 sm:px-6 cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {/* 
            Stage Ambience (separate unclipped layers behind slats):
            1. Curtain hairlines with radial fade mask
            2. Soft radial glow following the open slat
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 select-none overflow-visible"
          >
            {/* Curtain hairlines */}
            <div
              className="absolute -inset-x-20 -inset-y-10 opacity-70"
              style={{
                background:
                  'repeating-linear-gradient(90deg, rgba(48,84,255,.06) 0 1px, transparent 1px 72px)',
                WebkitMaskImage:
                  'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 0%, transparent 75%)',
                maskImage:
                  'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,1) 0%, transparent 75%)',
              }}
            />

            {/* Glowing spotlight following the active slat */}
            <motion.div
              style={{
                x: glowX,
                width: `${dimensions.Wo * 1.4}px`,
                height: `${dimensions.Hs * 1.7}px`,
                top: `${dimensions.Hs * 0.15}px`,
                marginLeft: `-${dimensions.Wo * 0.7}px`,
              }}
              className="pointer-events-none absolute -z-10 select-none will-change-transform"
            >
              <div
                className="h-full w-full"
                style={{
                  background:
                    'radial-gradient(closest-side at 50% 50%, rgba(48,84,255,.30) 0%, transparent 70%)',
                }}
              />
            </motion.div>
          </div>

          {/* Slat Row */}
          <div
            style={{
              height: `${dimensions.Hs}px`,
            }}
            className="relative flex w-full gap-3 items-stretch justify-start overflow-visible"
          >
            {achievements.map((item, idx) => (
              <Slat
                key={item.id}
                item={item}
                index={idx}
                t={t}
                Wo={dimensions.Wo}
                Wc={dimensions.Wc}
                Hs={dimensions.Hs}
                isActive={activeIndex === idx}
                onClick={() => navigateToAchievement(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              />
            ))}
          </div>

          {/* Description Panel (min-height 190px, no height jumping) */}
          <AchievementDetails
            item={achievements[activeIndex]}
            index={activeIndex}
            direction={direction}
          />

          {/* Slat Rail & Navigation */}
          <SlatRail
            t={t}
            activeIndex={activeIndex}
            hasMoved={hasMoved}
            onSelect={navigateToAchievement}
          />
        </motion.div>
      </div>
    </div>
  );
};
