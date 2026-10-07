export interface Project {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  kind: string;
  accent: string;
  urlLabel?: string;
  liveUrl?: string;
  image: string;
  alt: string;
  description: string;
  stack: string[];
}

export const projectsSectionData = {
  label: "PROJECTS",
  counter: "04 selected projects",
  heading: "Featured Projects",
  subtitle:
    "A showcase of intelligent platforms, web applications, and real-time systems built to solve real-world problems.",
};

export const projects: Project[] = [
  {
    id: "fixtoflex",
    index: "01",
    name: "FixToFlex",
    subtitle: "AI-Powered Job Application Command Centre",
    kind: "AI Career Platform",
    accent: "#8b5cf6",
    urlLabel: "fixtoflex.vercel.app",
    liveUrl: "https://fixtoflex.vercel.app",
    image: "/projects/fixtoflex",
    alt: "Screenshot of the FixToFlex landing page",
    description:
      "Built a full-stack AI career platform using Next.js, FastAPI, Supabase, Gemini AI, and web scraping. FixToFlex analyzes candidate profiles, resumes, portfolios, and job descriptions to provide personalized career insights, job/internship matching, interview preparation, application tracking, and recruiter-side candidate matching.",
    stack: [
      "Next.js",
      "React",
      "FastAPI",
      "Python",
      "Supabase",
      "Gemini AI",
      "Gmail API",
      "Scrape.do",
      "Tailwind CSS",
    ],
  },
  {
    id: "genquiz",
    index: "02",
    name: "GenQuiz",
    subtitle: "AI-Powered Multiplayer Quiz & Gaming Platform",
    kind: "AI Quiz & Gaming",
    accent: "#d946ef",
    urlLabel: "genquiz-iota.vercel.app",
    liveUrl: "https://genquiz-iota.vercel.app",
    image: "/projects/genquiz",
    alt: "Screenshot of the GenQuiz home screen",
    description:
      "Developed a full-stack AI-powered multiplayer quiz and gaming platform using React, FastAPI, Supabase, and WebSocket integration. Built features including AI quiz generation, real-time multiplayer rooms, manual quiz creation, voice interaction, and interactive mini-games with responsive UI/UX and smooth animations.",
    stack: ["React", "FastAPI", "Supabase", "WebSockets", "Tailwind CSS"],
  },
  {
    id: "global-ontology",
    index: "03",
    name: "Global Ontology Engine",
    subtitle: "AI-Powered Intelligence System",
    kind: "Intelligence System",
    accent: "#3054ff",
    urlLabel: "inquisitive-basbousa-ecf1ad.netlify.app",
    liveUrl: "https://inquisitive-basbousa-ecf1ad.netlify.app",
    image: "/projects/global-ontology",
    alt: "Screenshot of the Global Ontology Engine intelligence dashboard",
    description:
      "Our solution focuses on building a real-time global intelligence system that collects data from diverse sources (geopolitics, economy, defense, tech, climate), uses AI to extract structured insights from unstructured content, builds a dynamic knowledge graph, and enables decision-makers to gain actionable, explainable intelligence.",
    stack: ["React", "Flask", "OpenRouter", "Gemini", "Jina", "Supabase"],
  },
  {
    id: "tourism-guide",
    index: "04",
    name: "AI & Tourism App",
    subtitle: "Smart Guide",
    kind: "AI Tourism App",
    accent: "#14b8a6",
    image: "/projects/tourism-guide",
    alt: "Screenshot of the Tamil Nadu tourism discovery app",
    description:
      "Built a tourism application that combines Artificial Intelligence (LLM) with real-world tourism data to create an intelligent travel companion for exploring places like Tirunelveli (Nellai) and other districts of Tamil Nadu. The goal is to transform traditional tourism apps into a smart, conversational travel guide with providing reliable, location-aware information.",
    stack: ["Flutter", "Firebase", "Gemini AI", "Google Maps", "REST APIs"],
  },
];
