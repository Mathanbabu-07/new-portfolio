import { useEffect, useRef, useState, useCallback } from 'react';

export const SEQ_CONFIG = {
  frames: 73,
  startFrame: 12,
  pinFrame: 46,
  endFrame: 72,
  pinAt: 0.52,
  ease: 0.2, // Updated damping ease: 0.2
  maxDecodedDesktop: 40,
};

export interface FrameLoaderReturn {
  isReady: boolean;
  isMobile: boolean;
  dimensions: { width: number; height: number };
  initialFrameUrl: string;
  getNearestBitmap: (index: number) => ImageBitmap | null;
  prefetchAround: (index: number) => void;
  triggerPreload: () => void;
}

export function useFrameLoader(targetRef?: React.RefObject<HTMLElement | null>): FrameLoaderReturn {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const bitmapsRef = useRef<Map<number, ImageBitmap>>(new Map());
  const blobsRef = useRef<(Blob | null)[]>(new Array(SEQ_CONFIG.frames).fill(null));
  const decodingSetRef = useRef<Set<number>>(new Set());
  const isMountedRef = useRef(true);
  const isFetchingAllRef = useRef(false);

  // Responsive device breakpoint detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const basePath = isMobile ? '/about-seq/mobile' : '/about-seq/desktop';
  const dimensions = isMobile
    ? { width: 562, height: 466 }
    : { width: 1000, height: 830 };

  const getUrl = useCallback(
    (index: number) => `${basePath}/frame_${String(index + 1).padStart(4, '0')}.webp`,
    [basePath]
  );

  // Start gesture sequence at frame 12 (frame_0013.webp)
  const initialFrameUrl = getUrl(SEQ_CONFIG.startFrame);

  // Decode a single frame into ImageBitmap and manage cache
  const decodeFrame = useCallback(
    async (index: number, currentIndex = SEQ_CONFIG.startFrame) => {
      if (index < 0 || index >= SEQ_CONFIG.frames) return;
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

        // Evict farthest frame on desktop if memory exceeds limit
        // (Ensure frames 12..46 stay protected during initial approach)
        if (!isMobile && bitmapsRef.current.size > SEQ_CONFIG.maxDecodedDesktop) {
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
        console.debug(`Failed decoding frame ${index}:`, err);
      } finally {
        decodingSetRef.current.delete(index);
      }
    },
    [getUrl, isMobile]
  );

  // Fetch all blobs in background
  const fetchAllBlobs = useCallback(async () => {
    if (isFetchingAllRef.current) return;
    isFetchingAllRef.current = true;

    for (let i = 0; i < SEQ_CONFIG.frames; i += 6) {
      if (!isMountedRef.current) break;
      const batchSize = Math.min(6, SEQ_CONFIG.frames - i);
      const promises = Array.from({ length: batchSize }, async (_, k) => {
        const frameIdx = i + k;
        if (!blobsRef.current[frameIdx]) {
          try {
            const res = await fetch(getUrl(frameIdx));
            if (res.ok) {
              blobsRef.current[frameIdx] = await res.blob();
            }
          } catch {
            // Ignore prefetch failures
          }
        }
      });
      await Promise.all(promises);
    }
  }, [getUrl]);

  // EAGER PRELOAD: start fetching & decoding frames 12-46 while the Hero is on screen
  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    const preloadGesture = async () => {
      // Decode frame 12 first for instant initial render
      await decodeFrame(SEQ_CONFIG.startFrame, SEQ_CONFIG.startFrame);
      if (!cancelled && isMountedRef.current) {
        setIsReady(true);
      }

      // Pre-decode the full gesture arc (frames 12-46) in batches of 4
      for (let i = SEQ_CONFIG.startFrame; i <= SEQ_CONFIG.pinFrame; i += 4) {
        if (cancelled || !isMountedRef.current) break;
        const batch = Array.from(
          { length: Math.min(4, SEQ_CONFIG.pinFrame - i + 1) },
          (_, k) => decodeFrame(i + k, SEQ_CONFIG.startFrame)
        );
        await Promise.all(batch);
      }

      // Then fetch all remaining blobs in background
      if (!cancelled && isMountedRef.current) {
        fetchAllBlobs();
      }
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(() => preloadGesture(), { timeout: 800 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    } else {
      const timerId = setTimeout(() => preloadGesture(), 100);
      return () => {
        cancelled = true;
        clearTimeout(timerId);
      };
    }
  }, [decodeFrame, fetchAllBlobs]);

  // Fallback observer if section is scrolled quickly
  useEffect(() => {
    const target = targetRef?.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchAllBlobs();
          observer.disconnect();
        }
      },
      { rootMargin: '1200px 0px 1200px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchAllBlobs, targetRef]);

  // Cleanup all allocated ImageBitmaps on unmount
  useEffect(() => {
    isMountedRef.current = true;
    const bitmaps = bitmapsRef.current;
    return () => {
      isMountedRef.current = false;
      for (const bmp of bitmaps.values()) {
        try {
          bmp.close();
        } catch {
          // Ignored
        }
      }
      bitmaps.clear();
    };
  }, []);

  // Nearest frame retrieval (0 to 7 frame tolerance)
  const getNearestBitmap = useCallback((index: number): ImageBitmap | null => {
    const rounded = Math.round(index);
    for (let d = 0; d < 8; d++) {
      const left = bitmapsRef.current.get(rounded - d);
      if (left) return left;
      const right = bitmapsRef.current.get(rounded + d);
      if (right) return right;
    }
    return null;
  }, []);

  // Pre-decode around current playhead [-6 to +10]
  const prefetchAround = useCallback(
    (index: number) => {
      const rounded = Math.round(index);
      for (let d = -6; d <= 10; d++) {
        const targetIdx = Math.min(Math.max(rounded + d, 0), SEQ_CONFIG.frames - 1);
        decodeFrame(targetIdx, rounded);
      }
    },
    [decodeFrame]
  );

  return {
    isReady,
    isMobile,
    dimensions,
    initialFrameUrl,
    getNearestBitmap,
    prefetchAround,
    triggerPreload: fetchAllBlobs,
  };
}
