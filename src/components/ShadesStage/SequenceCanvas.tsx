import React, { useEffect, useRef } from 'react';
import { type MotionValue, useReducedMotion } from 'motion/react';
import { useSequenceLoader, SHADES_CONFIG } from './useSequenceLoader';

interface SequenceCanvasProps {
  targetFrame: MotionValue<number>;
  stageRef?: React.RefObject<HTMLElement | null>;
}

export const SequenceCanvas: React.FC<SequenceCanvasProps> = ({
  targetFrame,
  stageRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const {
    isReady,
    dimensions,
    initialFrameUrl,
    finalFrameUrl,
    getNearestBitmap,
    prefetchAround,
  } = useSequenceLoader(stageRef);

  const curRef = useRef<number>(0);
  const targetRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Subscribe to targetFrame changes and run the damped 60fps rAF loop
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

      // Damped chase formula: current += (target - current) * 0.18
      curRef.current += (targetRef.current - curRef.current) * SHADES_CONFIG.ease;
      const frameIndex = Math.round(curRef.current);

      const bitmap = getNearestBitmap(frameIndex);
      if (bitmap) {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        ctx.drawImage(bitmap, 0, 0);
      }

      // Decode surrounding window around current frame
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
      targetRef.current = Math.min(Math.max(latest, 0), SHADES_CONFIG.frames - 1);
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(render);
      }
    });

    // Initial render when ready
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

  // Reduced motion: static image of final frame (frame 96)
  if (shouldReduceMotion) {
    return (
      <div className="relative w-full h-full flex items-center justify-center select-none">
        <img
          src={finalFrameUrl}
          alt="Mathan Babu S in a suit and sunglasses with arms open"
          className="w-full h-full object-contain block"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" aria-hidden="true">
      {/* Static first-frame fallback visible while decoding initializes */}
      {!isReady && (
        <img
          src={initialFrameUrl}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain pointer-events-none block absolute inset-0"
        />
      )}

      {/* Transparent Canvas Frame Player (no CSS filters) */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        aria-hidden="true"
        className="w-full h-full object-contain block transform-gpu"
      />
    </div>
  );
};
