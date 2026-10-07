import React, { useEffect, useRef } from 'react';
import { type MotionValue, useReducedMotion } from 'motion/react';
import { useFrameLoader, SEQ_CONFIG } from './useFrameLoader';

interface ScrollSequenceProps {
  targetFrame: MotionValue<number>;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const ScrollSequence: React.FC<ScrollSequenceProps> = ({
  targetFrame,
  containerRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    isReady,
    isMobile,
    dimensions,
    initialFrameUrl,
    getNearestBitmap,
    prefetchAround,
  } = useFrameLoader(containerRef);

  // Keep tracking values in refs for the 60fps animation loop
  const curRef = useRef<number>(SEQ_CONFIG.startFrame);
  const targetRef = useRef<number>(SEQ_CONFIG.startFrame);
  const rafIdRef = useRef<number | null>(null);

  // Subscribe to MotionValue changes and kick off the damped rAF loop
  useEffect(() => {
    if (shouldReduceMotion) return;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        rafIdRef.current = null;
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafIdRef.current = null;
        return;
      }

      // Damped chase formula: current += (target - current) * ease (0.2)
      curRef.current += (targetRef.current - curRef.current) * SEQ_CONFIG.ease;
      const frameIndex = Math.round(curRef.current);

      const bitmap = getNearestBitmap(frameIndex);
      if (bitmap) {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        ctx.drawImage(bitmap, 0, 0);
      }

      // Pre-decode surrounding window
      prefetchAround(frameIndex);

      // Continue animating only while chasing the target
      if (Math.abs(targetRef.current - curRef.current) > 0.02) {
        rafIdRef.current = requestAnimationFrame(render);
      } else {
        curRef.current = targetRef.current;
        rafIdRef.current = null;
      }
    };

    const unsubscribe = targetFrame.on('change', (latest) => {
      targetRef.current = Math.min(Math.max(latest, 0), SEQ_CONFIG.frames - 1);
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(render);
      }
    });

    // Initial draw when ready
    if (isReady && !rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(render);
    }

    return () => {
      unsubscribe();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [targetFrame, isReady, dimensions, getNearestBitmap, prefetchAround, shouldReduceMotion]);

  // Drop-shadow only on desktop with motion enabled; disable on mobile (<1024px) or reduced motion
  const canvasFilter =
    !isMobile && !shouldReduceMotion
      ? 'drop-shadow(0 0 2px rgba(180,192,255,.5)) drop-shadow(0 0 20px rgba(48,84,255,.42)) contrast(1.05) brightness(.97) saturate(.95)'
      : 'contrast(1.05) brightness(.97) saturate(.95)';

  // Reduced motion: show clean static pointing pose (frame 46 => frame_0047.webp)
  if (shouldReduceMotion) {
    const staticPoseUrl = isMobile
      ? '/about-seq/mobile/frame_0047.webp'
      : '/about-seq/desktop/frame_0047.webp';

    return (
      <div className="relative w-full max-w-[480px] aspect-[1000/830] lg:w-auto lg:h-full lg:max-w-full lg:aspect-[1000/830] flex items-end justify-end select-none">
        {/* Glow layer, NOT masked, NOT overflow-clipped */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            style={{
              position: 'absolute',
              left: '-20%',
              right: '-20%',
              top: '-20%',
              bottom: '-15%',
              background: `radial-gradient(ellipse 45% 44% at ${isMobile ? '50% 50%' : '70% 50%'}, rgba(48,84,255,.34) 0%, rgba(48,84,255,.14) 45%, rgba(48,84,255,0) 100%)`,
            }}
          />
        </div>

        {/* Masked wrapper: padding stops glow clipping; canceled by negative margins */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            ['--pad' as any]: 'clamp(32px, 3.5vw, 64px)',
            margin: isMobile ? '0' : 'calc(var(--pad) * -1) calc(var(--pad) * -1) 0',
            padding: isMobile ? '0' : 'var(--pad) var(--pad) 0',
            boxSizing: isMobile ? 'border-box' : 'content-box',
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,.6) 88%, rgba(0,0,0,.2) 95%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,.6) 88%, rgba(0,0,0,.2) 95%, transparent 100%)',
          }}
        >
          <img
            src={staticPoseUrl}
            alt="Mathan Babu S in a black suit pointing toward the About text"
            className="w-full h-full object-contain object-right-bottom block"
            style={{
              filter: 'contrast(1.05) brightness(.97) saturate(.95)',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[480px] aspect-[1000/830] lg:w-auto lg:h-full lg:max-w-full lg:aspect-[1000/830] flex items-end justify-end select-none">
      {/* Glow layer, NOT masked, NOT overflow-clipped */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          style={{
            position: 'absolute',
            left: '-20%',
            right: '-20%',
            top: '-20%',
            bottom: '-15%',
            background: `radial-gradient(ellipse 45% 44% at ${isMobile ? '50% 50%' : '70% 50%'}, rgba(48,84,255,.34) 0%, rgba(48,84,255,.14) 45%, rgba(48,84,255,0) 100%)`,
          }}
        />
      </div>

      {/* Masked wrapper: padding stops glow clipping; canceled by negative margins */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          ['--pad' as any]: 'clamp(32px, 3.5vw, 64px)',
          margin: isMobile ? '0' : 'calc(var(--pad) * -1) calc(var(--pad) * -1) 0',
          padding: isMobile ? '0' : 'var(--pad) var(--pad) 0',
          boxSizing: isMobile ? 'border-box' : 'content-box',
          maskImage:
            'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,.6) 88%, rgba(0,0,0,.2) 95%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,.6) 88%, rgba(0,0,0,.2) 95%, transparent 100%)',
        }}
      >
        {/* Static first-frame fallback visible while decoding initializes */}
        {!isReady && (
          <img
            src={initialFrameUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain object-right-bottom pointer-events-none block"
            style={{
              filter: canvasFilter,
            }}
          />
        )}

        {/* Transparent Canvas Frame Player */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          aria-hidden="true"
          className="w-full h-full object-contain object-right-bottom block transform-gpu"
          style={{
            filter: canvasFilter,
          }}
        />
      </div>

      {/* Screen-reader accessible alternative */}
      <span className="sr-only">
        Interactive animated portrait of Mathan Babu S in a dark suit pointing toward the About section details.
      </span>
      <noscript>
        <img
          src="/about-seq/desktop/frame_0047.webp"
          alt="Mathan Babu S in a black suit pointing toward the About text"
          className="w-full h-auto"
        />
      </noscript>
    </div>
  );
};
