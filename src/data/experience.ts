export interface ExperienceItem {
  id: string;
  index: string;
  role: string;
  company: string;
  location: string;
  status: {
    label: string;
    live: boolean;
  };
  description: string;
  tags: string[];
  nodeIcon: 'Cpu' | 'Milk' | 'FlaskConical';
  photo: {
    src: string;
    srcSet: string;
    sizes: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
    aspectRatio: string; // e.g. "aspect-[2.2/1]" or "aspect-[4/5]"
  };
  layout: 'details-left' | 'photo-left';
}

export const experienceData = {
  label: "EXPERIENCE",
  title: "Experience & Journey",
  subtitle:
    "Hands-on background developing end-to-end applications, intelligent systems, and scalable technical solutions.",
  roles: [
    {
      id: "tarcin-robotics",
      index: "01",
      role: "Data Science & Web Development Intern",
      company: "Tarcin Robotics",
      location: "Madurai",
      status: {
        label: "Ongoing",
        live: true,
      },
      description:
        "Currently contributing to real-world software projects and AI-driven products, with hands-on involvement in data science workflows, web application development, AI integrations, and product implementation.",
      tags: [
        "Data Science",
        "Web Development",
        "AI Integrations",
        "AI-Driven Products",
        "Product Implementation",
      ],
      nodeIcon: "Cpu",
      photo: {
        src: "/experience/tarcin-team-1800.webp",
        srcSet:
          "/experience/tarcin-team-900.webp 900w, /experience/tarcin-team-1800.webp 1800w",
        sizes: "(min-width: 1024px) 640px, 92vw",
        width: 1800,
        height: 818,
        alt: "Team photo at Tarcin Robotics, Madurai",
        caption: "The Tarcin Robotics team",
        aspectRatio: "aspect-[2.2/1]",
      },
      layout: "details-left",
    },
    {
      id: "aavin-milk",
      index: "02",
      role: "10-Day Intern",
      company: "Aavin Milk Producers' Cooperative Union",
      location: "Madurai",
      status: {
        label: "10-day internship",
        live: false,
      },
      description:
        "Completed a 10-day internship involving milk quality testing and analysis, milk collection process exposure, and software development work for an internal project.",
      tags: [
        "Milk Quality Testing",
        "Collection Process",
        "Internal Software Project",
      ],
      nodeIcon: "Milk",
      photo: {
        src: "/experience/aavin-certificate-667.webp",
        srcSet:
          "/experience/aavin-certificate-400.webp 400w, /experience/aavin-certificate-667.webp 667w",
        sizes: "(min-width: 1024px) 460px, 80vw",
        width: 667,
        height: 834,
        alt: "Internship certificate presentation at Aavin, Madurai",
        caption: "Internship certificate",
        aspectRatio: "aspect-[4/5]",
      },
      layout: "photo-left",
    },
  ] as ExperienceItem[],
};
