import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { SequenceCanvas } from './SequenceCanvas';
import { StageBackgroundFX, StageGlintFX } from './StageFX';
import { SHADES_CONFIG } from './useSequenceLoader';

// Section height constant: 300vh = 200vh of pinned scroll
export const STAGE_HEIGHT_VH = 300;

export const ShadesStage: React.FC = () => {
  const stageRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // 1. Approach progress: stage scrolls into view before pinning
  // Figure wrapper: opacity 0->1, y 10vh->0, scale .94->1, blur 8px->0 over approach 0->0.45
  const { scrollYProgress: approachProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'start start'],
  });

  const approachOpacity = useTransform(approachProgress, [0, 0.45], [0, 1]);
  const approachY = useTransform(approachProgress, [0, 0.45], ['10vh', '0vh']);
  const approachScale = useTransform(approachProgress, [0, 0.45], [0.94, 1]);
  const approachBlur = useTransform(
    approachProgress,
    [0, 0.45],
    ['blur(8px)', 'blur(0px)']
  );

  // 2. Pin progress: stage is pinned top-0 for 200vh of scroll
  // Drives frame playback and stage dressing
  const { scrollYProgress: pinProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  });

  // Timeline mapping from manifest:
  // p: [0, 0.08, 0.40, 0.72, 0.92, 1] -> frame: [0, 12, 34, 62, 95, 95]
  const targetFrame = useTransform(
    pinProgress,
    SHADES_CONFIG.timeline.p,
    SHADES_CONFIG.timeline.frame,
    { clamp: true }
  );

  // Push-in: scale 1 to 1.04 across the pin (desktop only, origin 50% 40%)
  const pinPushIn = useTransform(pinProgress, [0, 1], [1, 1.04]);

  // Reduced motion: static clean layout without scrubbing or pinning
  if (shouldReduceMotion) {
    const staticFinalUrl = isDesktop
      ? '/shades-seq/desktop/frame_0096.webp'
      : '/shades-seq/mobile/frame_0096.webp';

    return (
      <section
        id="shades-stage"
        aria-label="Intro animation"
        className="relative bg-black min-h-screen py-24 flex items-center justify-center select-none"
      >
        <div className="relative w-full max-w-[1500px] px-4 flex items-center justify-center">
          {/* Static Stage Dressing */}
          <StageBackgroundFX pinProgress={pinProgress} isMobile={!isDesktop} />

          {/* Masked Figure Container */}
          <div
            className="relative w-[min(92vw,1500px,calc((100svh-6rem)*16/9))] aspect-[16/9] flex items-center justify-center"
            style={{
              ['--padX' as any]: '12%',
              ['--padTop' as any]: '8%',
              margin: 'calc(var(--padTop) * -1) calc(var(--padX) * -1) 0 calc(var(--padX) * -1)',
              padding: 'var(--padTop) var(--padX) 0 var(--padX)',
              boxSizing: 'content-box',
              WebkitMaskImage:
                'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,.6) 88%, rgba(0,0,0,.2) 95%, transparent 100%)',
              maskImage:
                'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,.6) 88%, rgba(0,0,0,.2) 95%, transparent 100%)',
            }}
          >
            <img
              src={staticFinalUrl}
              alt="Mathan Babu S in a suit and sunglasses with arms open"
              className="w-full h-full object-contain block select-none"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={stageRef}
      id="shades-stage"
      aria-label="Intro animation"
      className="relative bg-black select-none"
      style={{
        height: `${STAGE_HEIGHT_VH}vh`,
      }}
    >
      {/* 
        Sticky Viewport Stage
        - Centred horizontally and vertically via grid place-items-center
        - overflow-hidden on sticky stage only (no ancestor has overflow-hidden)
      */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden grid place-items-center">
        {/* Stage Dressing Layers behind the figure */}
        <StageBackgroundFX
          pinProgress={pinProgress}
          isMobile={!isDesktop}
        />

        {/* 
          Figure Wrapper
          - Desktop (>= 1024px): min(92vw, 1500px, calc((100svh - 6rem) * 16 / 9)), aspect-ratio 16/9
          - Mobile (< 1024px): 150vw aspect-ratio 16/9 (centered, arms may slightly bleed into stage overflow)
        */}
        <motion.div
          style={{
            opacity: approachOpacity,
            y: approachY,
            filter: approachBlur,
            scale: approachScale,
          }}
          className="relative z-10 w-full flex items-center justify-center select-none"
        >
          {/* Inner container handling desktop push-in scale */}
          <motion.div
            style={
              isDesktop
                ? {
                    scale: pinPushIn,
                    transformOrigin: '50% 40%',
                  }
                : {
                    left: '-25vw',
                  }
            }
            className={`relative flex items-center justify-center shrink-0 ${
              isDesktop
                ? 'w-[min(92vw,1500px,calc((100svh-6rem)*16/9))] aspect-[16/9]'
                : 'w-[150vw] aspect-[16/9]'
            }`}
          >
            {/* 
              Torso Dissolve Mask Parent
              - Horizontal padding: 12%+, top padding: 8%+
              - Canceled by equal negative margins with boxSizing: content-box
              - Mask dissolves lower 22% smoothly to transparent so straight bottom cut is invisible
            */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                ['--padX' as any]: '14%',
                ['--padTop' as any]: '10%',
                margin:
                  'calc(var(--padTop) * -1) calc(var(--padX) * -1) 0 calc(var(--padX) * -1)',
                padding: 'var(--padTop) var(--padX) 0 var(--padX)',
                boxSizing: 'content-box',
                WebkitMaskImage:
                  'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,.6) 88%, rgba(0,0,0,.2) 95%, transparent 100%)',
                maskImage:
                  'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,.6) 88%, rgba(0,0,0,.2) 95%, transparent 100%)',
              }}
            >
              {/* Scrubbed Canvas Player */}
              <SequenceCanvas
                targetFrame={targetFrame}
                stageRef={stageRef}
              />
            </div>

            {/* Lens Glint & Sparkle FX in front of canvas at glintAt (50%, 24%) */}
            <StageGlintFX pinProgress={pinProgress} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
