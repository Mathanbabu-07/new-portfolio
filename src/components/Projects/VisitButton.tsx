import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface VisitButtonProps {
  liveUrl: string;
  projectName: string;
  className?: string;
}

export const VisitButton: React.FC<VisitButtonProps> = ({
  liveUrl,
  projectName,
  className = '',
}) => {
  return (
    <a
      href={liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${projectName} (opens in a new tab)`}
      className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-[#ff7a1a]/70 bg-gradient-to-r from-[#ff7a1a]/20 to-[#ff4d00]/10 px-5 py-2.5 text-sm font-semibold text-[#ffd2b0] shadow-[0_0_0_1px_rgba(255,122,26,.25),0_0_28px_-4px_rgba(255,106,0,.55),inset_0_1px_0_rgba(255,200,150,.25)] transition-all duration-300 hover:bg-[#ff7a1a] hover:text-[#1a0a00] hover:shadow-[0_0_0_1px_rgba(255,122,26,.45),0_0_36px_-2px_rgba(255,106,0,.85),inset_0_1px_0_rgba(255,230,190,.5)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a1a]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${className}`}
    >
      {/* Diagonal white/40 sheen sweep across on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      {/* Pulsing neon orange dot */}
      <span aria-hidden="true" className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff7a1a] opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff7a1a] group-hover:bg-[#1a0a00] transition-colors duration-200" />
      </span>

      <span className="relative z-10 font-instrument-sans tracking-tight">Visit App</span>

      <ArrowUpRight
        aria-hidden="true"
        className="relative z-10 w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
};
