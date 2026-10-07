import React from 'react';
import {
  SiPython,
  SiC,
  SiCplusplus,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiFlutter,
  SiFastapi,
  SiFlask,
  SiIonic,
  SiSupabase,
  SiFirebase,
  SiVercel,
  SiRender,
  SiN8N,
  SiGrafana,
  SiAnaconda,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { TbChartBar } from 'react-icons/tb';
import {
  Bot,
  Brain,
  Sparkles,
  Workflow,
  Plug,
  MessageCircle,
  Flag,
  Clock,
  Puzzle,
  Handshake,
  Code2,
  Layers,
  Rocket,
  BrainCircuit,
  Users,
} from 'lucide-react';

interface IconProps {
  className?: string;
}

// Map each skill name to its monochrome icon component
const skillIconMap: Record<string, React.ComponentType<IconProps>> = {
  // Languages
  Python: SiPython,
  Java: FaJava,
  C: SiC,
  'C++': SiCplusplus,
  JavaScript: SiJavascript,

  // Frameworks
  'React.js': SiReact,
  'Next.js': SiNextdotjs,
  Flutter: SiFlutter,
  FastAPI: SiFastapi,
  Flask: SiFlask,
  Ionic: SiIonic,

  // Tools & Deployment
  Supabase: SiSupabase,
  Firebase: SiFirebase,
  Vercel: SiVercel,
  Render: SiRender,
  n8n: SiN8N,
  'Power BI': TbChartBar,
  Grafana: SiGrafana,
  Anaconda: SiAnaconda,

  // AI / ML
  'Agentic AI': Bot,
  'Context Engineering': Brain,
  'Vibe Coding': Sparkles,
  Automations: Workflow,
  'API Integrations': Plug,

  // Soft Skills
  Communication: MessageCircle,
  Leadership: Flag,
  'Time Management': Clock,
  'Problem Solving': Puzzle,
  Teamwork: Handshake,
};

// Map each category to its Lucide icon component
const categoryIconMap: Record<string, React.ComponentType<IconProps>> = {
  Code2: Code2,
  Layers: Layers,
  Rocket: Rocket,
  BrainCircuit: BrainCircuit,
  Users: Users,
  Languages: Code2,
  Frameworks: Layers,
  'Tools & Deployment': Rocket,
  'AI / ML': BrainCircuit,
  'Soft Skills': Users,
};

export const SkillIcon: React.FC<{
  name: string;
  className?: string;
}> = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = skillIconMap[name];

  if (!IconComponent) {
    // Fallback: rounded monogram tile with first letters
    const monogram = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <span
        aria-hidden="true"
        className="w-full h-full rounded-md bg-white/10 flex items-center justify-center text-[10px] font-mono font-semibold text-white/80"
      >
        {monogram}
      </span>
    );
  }

  return (
    <IconComponent
      aria-hidden="true"
      className={`${className} fill-current`}
    />
  );
};

export const CategoryIcon: React.FC<{
  name: string;
  className?: string;
}> = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = categoryIconMap[name];

  if (!IconComponent) {
    return <Code2 aria-hidden="true" className={className} />;
  }

  return <IconComponent aria-hidden="true" className={className} />;
};
