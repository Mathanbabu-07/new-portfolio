import React, { useRef } from 'react';
import { ArrowUpRight, Phone as PhoneIcon } from 'lucide-react';
import type { SocialChannel } from '../../data/contact';
import { CopyButton } from './CopyButton';

interface ChannelTileProps {
  channel: SocialChannel;
  onCopied: (msg: string) => void;
  className?: string;
}

export const ChannelTile: React.FC<ChannelTileProps> = ({
  channel,
  onCopied,
  className = '',
}) => {
  const tileRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !tileRef.current) return;
    const rect = tileRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    tileRef.current.style.setProperty('--mx', `${x}px`);
    tileRef.current.style.setProperty('--my', `${y}px`);
  };

  const handlePointerLeave = () => {
    if (!tileRef.current) return;
    tileRef.current.style.setProperty('--mx', '-9999px');
    tileRef.current.style.setProperty('--my', '-9999px');
  };

  return (
    <div
      ref={tileRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        {
          '--brand': channel.brand,
          '--mx': '-9999px',
          '--my': '-9999px',
        } as React.CSSProperties
      }
      className={`group relative flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#070d24]/70 p-5 lg:p-6 transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--brand)_55%,transparent)] overflow-hidden select-none ${className}`}
    >
      {/* Brand hover spotlight overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(360px circle at var(--mx) var(--my), color-mix(in srgb, var(--brand) 22%, transparent), transparent 60%)',
        }}
      />

      {/* Main Stretched Link */}
      <a
        href={channel.href}
        target={channel.isExternal ? '_blank' : undefined}
        rel={channel.isExternal ? 'noopener noreferrer' : undefined}
        aria-label={channel.ariaLabel}
        className="flex flex-1 items-center gap-4 min-w-0 outline-none after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff]"
      >
        {/* 56px Glass Circle Icon */}
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:-rotate-4">
          {channel.iconType === 'logo' && channel.logoSrc ? (
            <img
              src={channel.logoSrc}
              width={32}
              height={32}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain pointer-events-none"
            />
          ) : (
            <PhoneIcon
              className="h-6 w-6 text-white/85 pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Text info */}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-mono text-xs uppercase tracking-wider text-white/50">
            {channel.label}
          </span>
          <span className="font-instrument-sans text-[15px] font-medium text-white break-words transition-colors group-hover:text-white">
            {channel.handle}
          </span>
        </div>
      </a>

      {/* Far Right Action: CopyButton (Email / Phone) OR ArrowUpRight (Social) */}
      <div className="relative z-10 flex shrink-0 items-center">
        {channel.copyable && channel.copyValue ? (
          <CopyButton
            text={channel.copyValue}
            typeLabel={channel.label}
            onCopied={onCopied}
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-transparent text-white/40 transition-all duration-300 group-hover:text-white group-hover:border-white/20 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 pointer-events-none">
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
};
