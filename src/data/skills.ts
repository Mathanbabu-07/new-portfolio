export interface SkillItem {
  name: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  caption: string;
  iconName: string;
  badge?: string;
  skills: string[];
}

export const skillsData = {
  label: "SKILLS",
  title: "Skills & Technologies",
  subtitle:
    "Comprehensive stack spanning data science, artificial intelligence, and full-stack software development.",
  categories: {
    aiMl: {
      id: "ai-ml",
      title: "AI / ML",
      caption: "05 skills",
      iconName: "BrainCircuit",
      badge: "Core focus",
      skills: [
        "Agentic AI",
        "Context Engineering",
        "Vibe Coding",
        "Automations",
        "API Integrations",
      ],
    },
    languages: {
      id: "languages",
      title: "Languages",
      caption: "05 skills",
      iconName: "Code2",
      skills: ["Python", "Java", "C", "C++", "JavaScript"],
    },
    frameworks: {
      id: "frameworks",
      title: "Frameworks",
      caption: "06 skills",
      iconName: "Layers",
      skills: ["React.js", "Next.js", "Flutter", "FastAPI", "Flask", "Ionic"],
    },
    tools: {
      id: "tools",
      title: "Tools & Deployment",
      caption: "08 skills",
      iconName: "Rocket",
      skills: [
        "Supabase",
        "Firebase",
        "Vercel",
        "Render",
        "n8n",
        "Power BI",
        "Grafana",
        "Anaconda",
      ],
    },
    softSkills: {
      id: "soft-skills",
      title: "Soft Skills",
      caption: "05 skills",
      iconName: "Users",
      skills: [
        "Communication",
        "Leadership",
        "Time Management",
        "Problem Solving",
        "Teamwork",
      ],
    },
  },
} as const;

// All 29 skills in sequential category order for the marquee
export const allSkillNames: string[] = [
  ...skillsData.categories.aiMl.skills,
  ...skillsData.categories.languages.skills,
  ...skillsData.categories.frameworks.skills,
  ...skillsData.categories.tools.skills,
  ...skillsData.categories.softSkills.skills,
];
