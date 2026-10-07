import React, { memo, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from 'motion/react';

export const OVERLAY_HERO = 0.60;
export const OVERLAY_BODY = 0.72;

const VIDEO_SRC = "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";
const POSTER_SRC = "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080";

interface SiteBackgroundProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const SiteBackground = memo(function SiteBackground({ containerRef }: SiteBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked overlay opacity: 0.60 at hero -> 0.72 once About begins, held through Experience
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Hero is first ~20% of the 480vh zone (100vh / 480vh ≈ 0.21)
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.26, 1],
    [OVERLAY_HERO, OVERLAY_HERO, OVERLAY_BODY, OVERLAY_BODY]
  );

  // Mouse parallax motion values (normalized -1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Blob 1 moves ±20px; Blob 2 moves in opposite direction ±14px
  const blob1X = useTransform(smoothX, [-1, 1], [-20, 20]);
  const blob1Y = useTransform(smoothY, [-1, 1], [-20, 20]);
  const blob2X = useTransform(smoothX, [-1, 1], [14, -14]);
  const blob2Y = useTransform(smoothY, [-1, 1], [14, -14]);

  // 1. Single HLS instance with Safari fallback
  useEffect(() => {
    if (shouldReduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hlsRef.current = hls;
      hls.loadSource(VIDEO_SRC);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.debug("Auto-play prevented:", e));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = VIDEO_SRC;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.debug("Auto-play prevented:", e));
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [shouldReduceMotion]);

  // 2. Pause video when #bg-zone is off-screen, resume on return
  useEffect(() => {
    if (shouldReduceMotion) return;
    const video = videoRef.current;
    const zoneElement = containerRef?.current || document.getElementById('bg-zone');
    if (!video || !zoneElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        if (isVisible) {
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      },
      { rootMargin: '200px 0px 200px 0px' }
    );

    observer.observe(zoneElement);
    return () => observer.disconnect();
  }, [containerRef, shouldReduceMotion]);

  // 3. Pointer tracking for glow blobs (desktop and fine pointer only)
  useEffect(() => {
    if (shouldReduceMotion) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [shouldReduceMotion, mouseX, mouseY]);

  return (
    <div aria-hidden="true" className="relative w-full h-full pointer-events-none overflow-hidden select-none">
      {/* 1. Background Video Layer */}
      <video
        ref={videoRef}
        poster={POSTER_SRC}
        muted
        loop
        playsInline
        autoPlay={!shouldReduceMotion}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* 2. Video Overlay with dynamic opacity from 0.60 to 0.72 */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-black backdrop-blur-[2px]"
      />

      {/* 3. Decorative Gradients with subtle parallax */}
      {/* Top-left gradient: position top-[-20%] left-[20%], size 600x600px, bg-blue-900/20, blur-[120px], mix-blend-screen */}
      <motion.div
        style={{
          x: shouldReduceMotion ? 0 : blob1X,
          y: shouldReduceMotion ? 0 : blob1Y,
        }}
        className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen"
      />

      {/* Bottom-right gradient: position bottom-[-10%] right-[20%], size 500x500px, bg-indigo-900/20, blur-[120px], mix-blend-screen */}
      <motion.div
        style={{
          x: shouldReduceMotion ? 0 : blob2X,
          y: shouldReduceMotion ? 0 : blob2Y,
        }}
        className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen"
      />
    </div>
  );
});
