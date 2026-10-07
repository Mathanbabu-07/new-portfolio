import { useEffect, useRef, useState, useCallback } from 'react';

export const SHADES_CONFIG = {
  frames: 96,
  fps: 24,
  timeline: {
    p: [0, 0.08, 0.4, 0.72, 0.92, 1.0],
    frame: [0, 12, 34, 62, 95, 95],
  },
  glintAt: {
    x: 0.5,
    y: 0.24,
  },
  desktop: { width: 1280, height: 720 },
  mobile: { width: 960, height: 540 },
  ease: 0.18,
  windowSize: 28,
  prefetchBefore: 6,
  prefetchAfter: 10,
};

export interface SequenceLoaderReturn {
  isReady: boolean;
  isMobile: boolean;
  dimensions: { width: number; height: number };
  initialFrameUrl: string;
  finalFrameUrl: string;
  getNearestBitmap: (index: number) => ImageBitmap | null;
  prefetchAround: (index: number) => void;
}

export function useSequenceLoader(stageRef?: React.RefObject<HTMLElement | null>): SequenceLoaderReturn {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  const bitmapsRef = useRef<Map<number, ImageBitmap>>(new Map());
  const blobsRef = useRef<(Blob | null)[]>(new Array(SHADES_CONFIG.frames).fill(null));
  const decodingSetRef = useRef<Set<number>>(new Set());
  const isMountedRef = useRef(true);
  const isFetchingAllRef = useRef(false);
  const isNearRef = useRef(false);

  // Responsive device breakpoint detection (< 1024px is mobile)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const basePath = isMobile ? '/shades-seq/mobile' : '/shades-seq/desktop';
  const dimensions = isMobile ? SHADES_CONFIG.mobile : SHADES_CONFIG.desktop;

  const getUrl = useCallback(
    (index: number) => `${basePath}/frame_${String(index + 1).padStart(4, '0')}.webp`,
    [basePath]
  );

  const initialFrameUrl = getUrl(0);
  const finalFrameUrl = getUrl(SHADES_CONFIG.frames - 1);

  // Decode a single frame into ImageBitmap and maintain sliding window cache (max 28)
  const decodeFrame = useCallback(
    async (index: number, currentIndex = 0) => {
      if (index < 0 || index >= SHADES_CONFIG.frames) return;
      if (bitmapsRef.current.has(index) || decodingSetRef.current.has(index)) return;

      decodingSetRef.current.add(index);

      try {
        let blob = blobsRef.current[index];
        if (!blob) {
          const res = await fetch(getUrl(index));
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          blob = await res.blob();
          blobsRef.current[index] = blob;
        }

        if (!isMountedRef.current) return;

        const bitmap = await createImageBitmap(blob);

        if (!isMountedRef.current) {
          bitmap.close();
          return;
        }

        bitmapsRef.current.set(index, bitmap);

        // Evict farthest frame if size exceeds sliding window (28)
        if (bitmapsRef.current.size > SHADES_CONFIG.windowSize) {
          let farthestKey = index;
          let maxDistance = -1;

          for (const key of bitmapsRef.current.keys()) {
            const distance = Math.abs(key - currentIndex);
            if (distance > maxDistance) {
              maxDistance = distance;
              farthestKey = key;
            }
          }

          if (farthestKey !== index) {
            const farBmp = bitmapsRef.current.get(farthestKey);
            if (farBmp) {
              farBmp.close();
              bitmapsRef.current.delete(farthestKey);
            }
          }
        }
      } catch (err) {
        console.debug(`Failed decoding shades frame ${index}:`, err);
      } finally {
        decodingSetRef.current.delete(index);
      }
    },
    [getUrl]
  );

  // Fetch all blobs in ascending batches of 6 (low priority)
  const fetchAllBlobs = useCallback(async () => {
    if (isFetchingAllRef.current) return;
    isFetchingAllRef.current = true;

    for (let i = 0; i < SHADES_CONFIG.frames; i += 6) {
      if (!isMountedRef.current) break;

      const batch = Array.from(
        { length: Math.min(6, SHADES_CONFIG.frames - i) },
        (_, offset) => i + offset
      ).filter((idx) => !blobsRef.current[idx]);

      await Promise.all(
        batch.map(async (idx) => {
          try {
            const res = await fetch(getUrl(idx));
            if (res.ok) {
              const blob = await res.blob();
              blobsRef.current[idx] = blob;
            }
          } catch {
            // Ignore background prefetch errors
          }
        })
      );

      // Yield thread briefly between batches
      await new Promise((r) => setTimeout(r, 60));
    }
  }, [getUrl]);

  // Decode sliding window around playhead (prefetch -6 / +10)
  const prefetchAround = useCallback(
    (index: number) => {
      const start = Math.max(0, index - SHADES_CONFIG.prefetchBefore);
      const end = Math.min(SHADES_CONFIG.frames - 1, index + SHADES_CONFIG.prefetchAfter);

      for (let i = start; i <= end; i++) {
        if (!bitmapsRef.current.has(i)) {
          decodeFrame(i, index);
        }
      }
    },
    [decodeFrame]
  );

  // Retrieve nearest decoded bitmap within +/- 8 frames
  const getNearestBitmap = useCallback((index: number): ImageBitmap | null => {
    if (bitmapsRef.current.has(index)) {
      return bitmapsRef.current.get(index)!;
    }

    for (let offset = 1; offset <= 8; offset++) {
      const forward = index + offset;
      if (forward < SHADES_CONFIG.frames && bitmapsRef.current.has(forward)) {
        return bitmapsRef.current.get(forward)!;
      }
      const backward = index - offset;
      if (backward >= 0 && bitmapsRef.current.has(backward)) {
        return bitmapsRef.current.get(backward)!;
      }
    }

    return null;
  }, []);

  // Pre-load trigger: START when #skills enters viewport (rootMargin 100%) or after 2s idle
  useEffect(() => {
    isMountedRef.current = true;
    let idleTimer: number | null = null;
    let observer: IntersectionObserver | null = null;

    const startPreload = () => {
      // Decode initial window around frame 0
      decodeFrame(0, 0).then(() => {
        if (isMountedRef.current) setIsReady(true);
      });
      prefetchAround(0);

      // Background fetch all blobs
      fetchAllBlobs();
    };

    const skillsEl = document.getElementById('skills');
    if (skillsEl && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            startPreload();
            observer?.disconnect();
            observer = null;
          }
        },
        { rootMargin: '100% 0px 100% 0px' }
      );
      observer.observe(skillsEl);
    }

    // Fallback: 2s idle timer if skills section observer doesn't fire
    idleTimer = window.setTimeout(startPreload, 2000);

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (observer) observer.disconnect();
    };
  }, [decodeFrame, prefetchAround, fetchAllBlobs]);

  // Memory budget manager: when stage is > 2 viewports away, close all bitmaps to stay < 60 total
  useEffect(() => {
    const el = stageRef?.current || document.getElementById('shades-stage');
    if (!el || !('IntersectionObserver' in window)) return;

    const memObserver = new IntersectionObserver(
      ([entry]) => {
        const isNear = entry.isIntersecting;
        isNearRef.current = isNear;

        if (!isNear) {
          // Stage is more than 2 viewports away: evict all live bitmaps to free GPU memory
          bitmapsRef.current.forEach((bmp) => bmp.close());
          bitmapsRef.current.clear();
          setIsReady(false);
        } else {
          // Re-decode window around frame 0 when entering near distance
          decodeFrame(0, 0).then(() => {
            if (isMountedRef.current) setIsReady(true);
          });
          prefetchAround(0);
        }
      },
      { rootMargin: '200% 0px 200% 0px' }
    );

    memObserver.observe(el);

    return () => {
      memObserver.disconnect();
    };
  }, [stageRef, decodeFrame, prefetchAround]);

  // Cleanup on unmount: close all bitmaps
  useEffect(() => {
    const bitmaps = bitmapsRef.current;
    return () => {
      isMountedRef.current = false;
      bitmaps.forEach((bmp) => bmp.close());
      bitmaps.clear();
    };
  }, []);

  return {
    isReady,
    isMobile,
    dimensions,
    initialFrameUrl,
    finalFrameUrl,
    getNearestBitmap,
    prefetchAround,
  };
}
