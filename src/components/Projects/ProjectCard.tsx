import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useReducedMotion,
  useMotionValue,
} from 'motion/react';
import type { Project } from '../../data/projects';
import { BrowserFrame } from './BrowserFrame';
import { TechChip } from './TechChip';
import { VisitButton } from './VisitButton';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: '200px 0px 200px 0px' });
  const shouldReduceMotion = useReducedMotion();

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Left column dir = +1 (index 0, 2), right column dir = -1 (index 1, 3)
  const isLeft = index % 2 === 0;
  const dir = isLeft ? 1 : -1;

  // 1. Scroll-linked Rack Focus
  const { scrollYProgress: p } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Focus progress: f = 0 at start/end, peaks at 1 when row is centred (p = 0.5)
  const f = useTransform(p, [0, 0.22, 0.5, 0.78, 1], [0, 0.65, 1, 0.65, 0]);

  // Spring smoothing config
  const springConfig = { stiffness: 140, damping: 26, mass: 0.4 };

  // Desktop 3D rotation transforms
  const rawRotateX = useTransform(p, [0, 0.5, 1], [10, 0, -6]);
  const rawRotateY = useTransform(p, [0, 0.5, 1], [dir * 9, 0, dir * -4]);
  const rawTranslateZ = useTransform(f, [0, 1], [-60, 0]);
  const rawScale = useTransform(f, [0, 1], [0.94, 1]);

  // Column breathing: left [24, 0, -24]px, right [56, 0, -56]px (both 0 at p=0.5)
  const rawTranslateY = useTransform(
    p,
    [0, 0.5, 1],
    isLeft ? [24, 0, -24] : [56, 0, -56]
  );

  const smoothRotateX = useSpring(rawRotateX, springConfig);
  const smoothRotateY = useSpring(rawRotateY, springConfig);
  const smoothTranslateZ = useSpring(rawTranslateZ, springConfig);
  const smoothScale = useSpring(rawScale, springConfig);
  const smoothTranslateY = useSpring(rawTranslateY, springConfig);

  // Mobile transforms (<1024px): no 3D rotation, no column breathing, scale 0.96 to 1
  const rawMobileScale = useTransform(f, [0, 1], [0.96, 1]);
  const smoothMobileScale = useSpring(rawMobileScale, springConfig);

  // Card opacity: 0 to 1 over p 0 to 0.18, then 1 (text never dims)
  const cardOpacity = useTransform(p, [0, 0.18], [0, 1], { clamp: true });

  // Outer glow opacity: f * 0.9
  const glowOpacity = useTransform(f, (v) => v * 0.9);

  // Top light opacity: f * 0.5
  const topLightOpacity = useTransform(f, (v) => v * 0.5);

  // Border brightening from rgba(255,255,255,0.1) to rgba(255,255,255,0.25)
  const borderColor = useTransform(
    f,
    (v) => `rgba(255, 255, 255, ${0.1 + v * 0.15})`
  );

  // Image dark overlay driven by focus (0.55 to 0) to tame light screenshots
  const imageOverlayOpacity = useTransform(f, [0, 1], [0.55, 0]);

  // Camera dolly: translateY -2.5% to +2.5% over p [0,1], scale 1.06 to 1.0 over f
  const dollyY = useTransform(p, [0, 1], ['-2.5%', '2.5%']);
  const dollyScale = useTransform(f, [0, 1], [1.06, 1.0]);

  // 2. Cursor Hover Tilt & Glare (fine pointers)
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const hoverTiltX = useSpring(
    useTransform(mouseY, [0, 1], [4, -4]),
    { stiffness: 220, damping: 22 }
  );
  const hoverTiltY = useSpring(
    useTransform(mouseX, [0, 1], [-4, 4]),
    { stiffness: 220, damping: 22 }
  );

  const [glarePos, setGlarePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x / rect.width);
    mouseY.set(y / rect.height);
    setGlarePos({ x, y });
  };

  const handleMouseEnter = () => {
    if (isDesktop) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Determine active animated values based on motion preference and device
  const activeOpacity = shouldReduceMotion ? 1 : cardOpacity;
  const activeScale = shouldReduceMotion
    ? 1
    : isDesktop
    ? smoothScale
    : smoothMobileScale;
  const activeRotateX = shouldReduceMotion || !isDesktop ? 0 : smoothRotateX;
  const activeRotateY = shouldReduceMotion || !isDesktop ? 0 : smoothRotateY;
  const activeTranslateZ = shouldReduceMotion || !isDesktop ? 0 : smoothTranslateZ;
  const activeTranslateY = shouldReduceMotion || !isDesktop ? 0 : smoothTranslateY;

  return (
    <div
      ref={cardRef}
      className="relative h-full flex flex-col [transform-style:preserve-3d]"
      style={
        {
          ['--accent' as any]: project.accent,
        }
      }
    >
      {/* Outer Glow (radial gradient, alpha 0 well before box edge) */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          style={{
            opacity: glowOpacity,
          }}
          className="pointer-events-none absolute -inset-[15%] -z-10 select-none"
        >
          <div
            className="h-full w-full"
            style={{
              background:
                'radial-gradient(closest-side at 50% 50%, color-mix(in srgb, var(--accent) 34%, transparent) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      )}

      {/* 3D Animated Card Container */}
      <motion.div
        style={{
          opacity: activeOpacity,
          scale: activeScale,
          rotateX: activeRotateX,
          rotateY: activeRotateY,
          z: activeTranslateZ,
          y: activeTranslateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative flex h-full flex-col ${
          isInView ? 'will-change-transform' : ''
        }`}
      >
        {/* Nested Hover Tilt Wrapper */}
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: isHovered && isDesktop ? hoverTiltX : 0,
            rotateY: isHovered && isDesktop ? hoverTiltY : 0,
            transformStyle: 'preserve-3d',
          }}
          className="relative flex h-full flex-col"
        >
          {/* Main Card Shell (No backdrop-blur to avoid 3D transform glitches) */}
          <motion.article
            aria-labelledby={`project-${project.id}-title`}
            style={{
              borderColor: shouldReduceMotion ? 'rgba(255,255,255,0.1)' : borderColor,
            }}
            className="group relative flex h-full flex-col rounded-3xl border bg-[#070d24]/80 p-3 lg:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_24px_60px_rgba(0,0,0,.45)] overflow-hidden"
          >
            {/* Top Light Accent Inside Card */}
            {!shouldReduceMotion && (
              <motion.div
                aria-hidden="true"
                style={{
                  opacity: topLightOpacity,
                }}
                className="pointer-events-none absolute inset-x-0 top-0 h-[140px] select-none"
              >
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      'radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 100%)',
                  }}
                />
              </motion.div>
            )}

            {/* Cursor Glare on Hover */}
            {isHovered && isDesktop && !shouldReduceMotion && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 select-none transition-opacity duration-200"
                style={{
                  background: `radial-gradient(circle 350px at ${glarePos.x}px ${glarePos.y}px, rgba(255,255,255,0.08), transparent 80%)`,
                }}
              />
            )}

            {/* 1. Browser Frame Image Display */}
            <BrowserFrame
              name={project.name}
              urlLabel={project.urlLabel}
              image={project.image}
              alt={project.alt}
              overlayOpacity={shouldReduceMotion ? undefined : imageOverlayOpacity}
              dollyY={shouldReduceMotion || !isDesktop ? undefined : dollyY}
              dollyScale={shouldReduceMotion ? undefined : dollyScale}
              isHovered={isHovered}
            />

            {/* 2. Info Block */}
            <div className="relative z-10 flex flex-1 flex-col px-2 pb-2 pt-5 lg:px-3">
              {/* Row 1: Index Number + Kind Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-semibold tracking-wider text-[#b4c0ff]/70">
                  {project.index} / 04
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium text-white/70 tracking-tight">
                  {project.kind}
                </span>
              </div>

              {/* Project Title */}
              <h3
                id={`project-${project.id}-title`}
                className="font-instrument-sans font-semibold tracking-tight text-[clamp(1.5rem,2.3vw,2rem)] leading-[1.1] bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent mb-1"
              >
                {project.name}
              </h3>

              {/* Subtitle */}
              <p className="font-instrument-serif italic text-lg text-white/80 mb-3">
                {project.subtitle}
              </p>

              {/* Description (never truncated) */}
              <p className="font-instrument-sans text-[15px] leading-[1.7] text-white/70 mb-5">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="mt-auto pt-2">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                  TECH STACK
                </span>
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <TechChip key={tech} name={tech} />
                  ))}
                </ul>
              </div>

              {/* Footer CTA: VisitButton ONLY when liveUrl exists */}
              {project.liveUrl && (
                <div className="mt-auto pt-6 flex items-center justify-start">
                  <VisitButton
                    liveUrl={project.liveUrl}
                    projectName={project.name}
                  />
                </div>
              )}
            </div>
          </motion.article>
        </motion.div>
      </motion.div>
    </div>
  );
};
