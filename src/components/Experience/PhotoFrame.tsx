import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { Camera } from 'lucide-react';
import type { ExperienceItem } from '../../data/experience';

interface PhotoFrameProps {
  photo: ExperienceItem['photo'];
  isInView: boolean;
  className?: string;
}

const SLAT_COUNT = 8;
const SLAT_EASE = [0.76, 0, 0.24, 1] as const;
const BASE_EASE = [0.22, 1, 0.36, 1] as const;

export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  photo,
  isInView,
  className = '',
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Parallax scroll-out effect (desktop only, translated -2% to +2% over frame scroll progress)
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-2%', '2%']);

  return (
    <div
      ref={frameRef}
      className={`group relative w-full max-w-[420px] lg:max-w-none mx-auto lg:mx-0 rounded-[28px] border border-white/10 bg-white/[0.04] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_24px_60px_rgba(0,0,0,.45)] ${className}`}
    >
      {/* Inner Image Container with exact aspect ratio */}
      <div
        className={`relative w-full overflow-hidden rounded-[20px] select-none ${photo.aspectRatio}`}
      >
        {/* Parallax / Animated Image */}
        <motion.div
          className="relative h-full w-full"
          style={{
            y: !shouldReduceMotion && isDesktop ? parallaxY : 0,
            transformOrigin: '50% 20%',
          }}
          initial={{
            scale: shouldReduceMotion ? 1 : 1.12,
          }}
          animate={
            isInView
              ? { scale: shouldReduceMotion ? 1 : 1.06 }
              : { scale: shouldReduceMotion ? 1 : 1.12 }
          }
          transition={{
            duration: 1.2,
            ease: BASE_EASE,
          }}
        >
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            sizes={photo.sizes}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover block transition-all duration-300 ease-out group-hover:scale-[1.03]"
            style={{
              filter: 'saturate(0.88) contrast(1.04)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter =
                'saturate(1) contrast(1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.filter =
                'saturate(0.88) contrast(1.04)';
            }}
          />
        </motion.div>

        {/* (a) Bottom Grade on lower 40% */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#070d24]/80 via-transparent to-transparent z-10"
        />

        {/* (b) Blue Theme Tint (fades out on hover) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#1a2a7a]/15 transition-opacity duration-300 group-hover:opacity-0 z-10"
        />

        {/* (c) Viewfinder Corners (four 14px L-shaped brackets, 1.5px, #b4c0ff/70, inset 14px) */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.5,
            delay: shouldReduceMotion ? 0.2 : 0.7,
            ease: BASE_EASE,
          }}
        >
          {/* Top-Left */}
          <span className="absolute top-[14px] left-[14px] h-[14px] w-[14px] border-t-[1.5px] border-l-[1.5px] border-[#b4c0ff]/70" />
          {/* Top-Right */}
          <span className="absolute top-[14px] right-[14px] h-[14px] w-[14px] border-t-[1.5px] border-r-[1.5px] border-[#b4c0ff]/70" />
          {/* Bottom-Left */}
          <span className="absolute bottom-[14px] left-[14px] h-[14px] w-[14px] border-b-[1.5px] border-l-[1.5px] border-[#b4c0ff]/70" />
          {/* Bottom-Right */}
          <span className="absolute bottom-[14px] right-[14px] h-[14px] w-[14px] border-b-[1.5px] border-r-[1.5px] border-[#b4c0ff]/70" />
        </motion.div>

        {/* (d) Caption Pill Bottom-Left */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: shouldReduceMotion ? 0 : 8 }
          }
          transition={{
            duration: 0.5,
            delay: shouldReduceMotion ? 0.2 : 0.75,
            ease: BASE_EASE,
          }}
          className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#070d24]/70 border border-white/10 text-xs text-white/80 select-none z-20 pointer-events-none"
        >
          <Camera aria-hidden="true" className="w-3 h-3 text-[#b4c0ff]" />
          <span>{photo.caption}</span>
        </motion.div>

        {/* CURTAIN REVEAL: 8 vertical slats lifting with scaleY 1 to 0 */}
        {!shouldReduceMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
          >
            {Array.from({ length: SLAT_COUNT }).map((_, i) => (
              <motion.div
                key={`slat-${i}`}
                className="absolute inset-y-0 bg-[#050b24] border-l border-white/5"
                style={{
                  width: `${100 / SLAT_COUNT}%`,
                  left: `${(i * 100) / SLAT_COUNT}%`,
                  transformOrigin: 'top',
                }}
                initial={{ scaleY: 1 }}
                animate={isInView ? { scaleY: 0 } : { scaleY: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.06,
                  ease: SLAT_EASE,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
