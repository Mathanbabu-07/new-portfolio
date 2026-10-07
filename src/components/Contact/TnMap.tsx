import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { contactData } from '../../data/contact';
import mapData from '../../data/tn-dots.json';

interface MapJson {
  aspect: number;
  dots: [number, number][];
  outline: [number, number][];
  madurai: [number, number];
  madurai_latlon: [number, number];
}

const data = mapData as unknown as MapJson;

// Precompute distances once at module load
const [mX, mY] = data.madurai;
const dotDistances: number[] = data.dots.map(([x, y]) =>
  Math.hypot(x - mX, y - mY)
);
const maxD = Math.max(...dotDistances);
const normalizedDistances = dotDistances.map((d) => d / maxD);

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export const TnMap: React.FC = () => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll linked signal wave progress: 0 to 1
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 90%', 'center 55%'],
  });

  const pSpring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.5,
  });

  // Keep latest p value in ref to avoid re-binding rAF on every tick
  const pRef = useRef(0);
  const isInViewRef = useRef(false);
  const isTabVisibleRef = useRef(true);
  const idlePulseStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = pSpring.on('change', (val) => {
      pRef.current = Math.max(0, Math.min(1, val));
    });
    return () => unsub();
  }, [pSpring]);

  useEffect(() => {
    const handleVisibility = () => {
      isTabVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    let animId: number;
    let dpr = window.devicePixelRatio || 1;
    let canvasW = 0;
    let canvasH = 0;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvasW = rect.width;
      canvasH = rect.height;
      canvas.width = Math.round(canvasW * dpr);
      canvas.height = Math.round(canvasH * dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // IntersectionObserver to pause when off-screen
    const io = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(card);

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);

      if (!isInViewRef.current || !isTabVisibleRef.current) return;
      if (canvasW <= 0 || canvasH <= 0) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // 1. Draw Tamil Nadu state outline polyline
      ctx.beginPath();
      const outline = data.outline;
      if (outline.length > 0) {
        ctx.moveTo(outline[0][0] * canvasW, outline[0][1] * canvasH);
        for (let i = 1; i < outline.length; i++) {
          ctx.lineTo(outline[i][0] * canvasW, outline[i][1] * canvasH);
        }
        ctx.closePath();
      }
      ctx.strokeStyle = 'rgba(120, 150, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Draw dots with scroll-linked wave or idle pulse
      const p = shouldReduceMotion ? 1 : pRef.current;
      const R = p * 1.15;

      // Idle pulse logic (every 5s when p is settled near 1)
      let pulseActive = false;
      let pulseR = -1;
      if (!shouldReduceMotion && p >= 0.98) {
        if (idlePulseStartTimeRef.current === null) {
          idlePulseStartTimeRef.current = now;
        }
        const elapsedSinceCycle = (now - idlePulseStartTimeRef.current) % 5000;
        if (elapsedSinceCycle < 1800) {
          pulseActive = true;
          pulseR = (elapsedSinceCycle / 1800) * 1.15;
        }
      } else {
        idlePulseStartTimeRef.current = null;
      }

      const dotRadius = canvasW * 0.0055;
      const dots = data.dots;

      for (let i = 0; i < dots.length; i++) {
        const [x, y] = dots[i];
        const dn = normalizedDistances[i];
        const px = x * canvasW;
        const py = y * canvasH;

        // Base lit wave front
        const waveFront = shouldReduceMotion ? 1 : 1 - smoothstep(R - 0.18, R, dn);
        const litAlpha = 0.22 + 0.78 * Math.pow(Math.max(0, 1 - dn), 1.6);
        let alpha = 0.12 + (litAlpha - 0.12) * waveFront;

        // Bright edge ring along main wave front
        let edge = 0;
        if (!shouldReduceMotion && p > 0.02) {
          edge = Math.exp(-Math.pow((dn - R) / 0.05, 2)) * Math.min(1, p * 2.5);
          alpha = Math.min(1, alpha + edge * 0.65);
        }

        // Idle pulse wave contribution
        if (pulseActive && pulseR > 0) {
          const pulseEdge =
            Math.exp(-Math.pow((dn - pulseR) / 0.06, 2)) * 0.35;
          alpha = Math.min(1, alpha + pulseEdge);
          edge = Math.max(edge, pulseEdge);
        }

        // Mix colour from rgba(140, 165, 255) toward white by edge
        const r = Math.round(140 + (255 - 140) * edge);
        const g = Math.round(165 + (255 - 165) * edge);
        const b = 255;

        ctx.beginPath();
        ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
    };
  }, [shouldReduceMotion]);

  return (
    <a
      ref={cardRef}
      href={contactData.location.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Madurai, Tamil Nadu on Google Maps (opens in a new tab)"
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#070d24]/70 p-5 lg:p-6 transition-colors duration-300 hover:border-[#3054ff]/50 outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff] select-none"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3054ff] shadow-[0_0_8px_#3054ff]" />
          <span className="font-mono text-xs uppercase tracking-wider text-white/50">
            LOCATION
          </span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-white/70">
          Tamil Nadu, IN
        </span>
      </div>

      {/* Canvas Area with HTML Marker Overlay */}
      <div className="relative my-auto flex w-full max-w-[320px] mx-auto items-center justify-center aspect-[0.7471]">
        <canvas
          ref={canvasRef}
          className="h-full w-full block pointer-events-none"
        />

        {/* Marker (HTML overlay at Madurai position) */}
        <div
          style={{
            left: `${data.madurai[0] * 100}%`,
            top: `${data.madurai[1] * 100}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {/* Animated CSS Pulse Rings (paused when reduced motion) */}
          {!shouldReduceMotion && (
            <>
              <span
                style={{
                  animation: 'pulseRing 2.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                }}
                className="absolute inset-0 -m-1.5 h-6 w-6 rounded-full border border-[#3054ff] opacity-50"
              />
              <span
                style={{
                  animation: 'pulseRing 2.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                  animationDelay: '1.2s',
                }}
                className="absolute inset-0 -m-1.5 h-6 w-6 rounded-full border border-[#b4c0ff] opacity-40"
              />
            </>
          )}

          {/* 10px Center Dot with #3054ff ring */}
          <motion.div
            initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative h-2.5 w-2.5 rounded-full bg-white ring-2 ring-[#3054ff] shadow-[0_0_10px_#3054ff]"
          />

          {/* Leader Line + Glass Pill Label "Madurai" */}
          <div className="absolute -top-7 left-3 flex items-center gap-1">
            {/* 1px diagonal leader line */}
            <div className="h-4 w-4 -rotate-45 border-l border-b border-[#3054ff]/60 -translate-x-1 translate-y-1" />
            <div className="rounded-full border border-white/15 bg-[#070d24]/90 px-2.5 py-0.5 shadow-md">
              <span className="font-instrument-sans text-[11px] font-semibold text-white tracking-wide">
                Madurai
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="font-mono text-xs text-white/50">
          9.93° N · 78.12° E
        </span>

        <span className="inline-flex items-center gap-1 font-instrument-sans text-xs text-white/70 transition-colors group-hover:text-white">
          <span>View on Google Maps</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>

      <style>{`
        @keyframes pulseRing {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: scale(3.2);
            opacity: 0;
          }
        }
      `}</style>
    </a>
  );
};
