import React from 'react';
import {
  SiNextdotjs,
  SiReact,
  SiFastapi,
  SiPython,
  SiSupabase,
  SiGooglegemini,
  SiGmail,
  SiTailwindcss,
  SiFlask,
  SiOpenrouter,
  SiFlutter,
  SiFirebase,
  SiGooglemaps,
} from 'react-icons/si';
import { TbWorldWww, TbPlugConnected, TbApi } from 'react-icons/tb';

interface TechIconProps {
  name: string;
  className?: string;
}

export const TechIcon: React.FC<TechIconProps> = ({ name, className = 'w-3.5 h-3.5' }) => {
  const norm = name.trim().toLowerCase();

  switch (norm) {
    case 'next.js':
    case 'nextjs':
      return <SiNextdotjs className={className} />;
    case 'react':
      return <SiReact className={className} />;
    case 'fastapi':
      return <SiFastapi className={className} />;
    case 'python':
      return <SiPython className={className} />;
    case 'supabase':
      return <SiSupabase className={className} />;
    case 'gemini':
    case 'gemini ai':
      return <SiGooglegemini className={className} />;
    case 'gmail api':
    case 'gmail':
      return <SiGmail className={className} />;
    case 'tailwind css':
    case 'tailwindcss':
      return <SiTailwindcss className={className} />;
    case 'flask':
      return <SiFlask className={className} />;
    case 'openrouter':
      return <SiOpenrouter className={className} />;
    case 'flutter':
      return <SiFlutter className={className} />;
    case 'firebase':
      return <SiFirebase className={className} />;
    case 'google maps':
      return <SiGooglemaps className={className} />;
    case 'scrape.do':
      return <TbWorldWww className={className} />;
    case 'websockets':
    case 'websocket':
      return <TbPlugConnected className={className} />;
    case 'rest apis':
    case 'rest api':
      return <TbApi className={className} />;
    case 'jina':
      return (
        <span
          className="inline-flex items-center justify-center font-mono font-bold text-[11px] leading-none text-current"
          style={{ width: '1em', height: '1em' }}
        >
          J
        </span>
      );
    default: {
      const letter = name.charAt(0).toUpperCase() || '•';
      return (
        <span
          className="inline-flex items-center justify-center font-mono font-bold text-[11px] leading-none text-current"
          style={{ width: '1em', height: '1em' }}
        >
          {letter}
        </span>
      );
    }
  }
};
