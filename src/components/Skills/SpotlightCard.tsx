import React, { useRef } from 'react';
import { CategoryIcon } from './skillIcons';

interface SpotlightCardProps {
  id: string;
  title: string;
  caption: string;
  iconName: string;
  badge?: string;
  className?: string;
  cardBg?: string;
  children: React.ReactNode;
  headerAside?: React.ReactNode;
  titleSuffix?: React.ReactNode;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  id,
  title,
  caption,
  iconName,
  badge,
  className = '',
  cardBg,
  children,
  headerAside,
  titleSuffix,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Spotlight applies to fine pointer devices only
    if (e.pointerType !== 'mouse') return;

    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        rafId.current = null;
      });
    }
  };

  const handlePointerLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const headingId = `skills-cat-${id}`;

  return (
    <article
      ref={cardRef}
      aria-labelledby={headingId}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 ${
        cardBg || 'bg-[#070d24]/55'
      } backdrop-blur-lg p-6 lg:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_20px_50px_rgba(0,0,0,.35)] flex flex-col justify-between ${className}`}
    >
      {/* 1px top highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#3054ff]/60 to-transparent rounded-t-3xl"
      />

      {/* Faint dotted texture with radial fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none opacity-80"
        style={{
          background:
            'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px) 0 0 / 22px 22px',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 85%)',
          maskImage:
            'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 85%)',
        }}
      />

      {/* Spotlight Overlay 1: Inner Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden [@media(pointer:fine)]:block motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, -9999px) var(--my, -9999px), rgba(48,84,255,.16), transparent 60%)',
        }}
      />

      {/* Spotlight Overlay 2: 1px Border Glow using mask-composite exclude */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1px] transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden [@media(pointer:fine)]:block motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, -9999px) var(--my, -9999px), rgba(180,192,255,.5), transparent 70%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        }}
      />

      {/* Card Header Row */}
      <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <h3
              id={headingId}
              className="font-instrument-serif text-2xl lg:text-[28px] text-white tracking-normal font-normal leading-tight"
            >
              {title}
            </h3>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium tracking-wide bg-[#3054ff]/20 text-[#b4c0ff] border border-[#3054ff]/40 shadow-[0_0_12px_rgba(48,84,255,0.3)]">
                {badge}
              </span>
            )}
            {titleSuffix}
          </div>
          <span className="font-mono text-xs text-white/50 tracking-wider">
            {caption}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {headerAside}
          {/* 36px Glass Circle with Category Icon */}
          <div
            aria-hidden="true"
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] flex-shrink-0"
          >
            <CategoryIcon name={iconName} className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
        {children}
      </div>
    </article>
  );
};
