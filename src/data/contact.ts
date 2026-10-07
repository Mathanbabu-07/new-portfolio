export interface SocialChannel {
  id: string;
  label: string;
  brand: string;
  iconType: 'logo' | 'lucide';
  logoSrc?: string;
  handle: string;
  href: string;
  ariaLabel: string;
  isExternal: boolean;
  copyable?: boolean;
  copyValue?: string;
}

export const contactData = {
  email: "s.mathanbabu2007@gmail.com",
  phoneDisplay: "+91 82701 52417",
  phoneTel: "+918270152417",
  instagram: {
    handle: "@mathanbabu218",
    url: "https://www.instagram.com/mathanbabu218/",
  },
  github: {
    handle: "Mathanbabu-07",
    url: "https://github.com/Mathanbabu-07",
  },
  linkedin: {
    handle: "mathan-babu-8331b1355",
    url: "https://www.linkedin.com/in/mathan-babu-8331b1355",
  },
  location: {
    label: "Madurai, Tamil Nadu",
    country: "India",
    lat: 9.9252,
    lon: 78.1198,
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Madurai%2C+Tamil+Nadu",
  },
  copy: {
    label: "CONTACT",
    chip: "Open to opportunities",
    heading: "Let's build something impactful together.",
    subtitle: "Have an idea, an opportunity or a project in mind? I'd love to hear from you.",
  },
  footer: {
    tagline: "Turning ideas into impactful digital solutions.",
    copyright: "© 2026 Mathanbabu · Mathan Solutions",
  },
  resume: {
    href: "/resume.pdf",
    downloadName: "Mathan-Babu-S-Resume.pdf",
  },
  emailCtaHref: "mailto:s.mathanbabu2007@gmail.com?subject=Portfolio%20enquiry",
  brandColors: {
    gmail: "#EA4335",
    phone: "#b4c0ff",
    linkedin: "#0A66C2",
    github: "#ffffff",
    instagram: "#D62976",
  },
};

export const channelTiles: SocialChannel[] = [
  {
    id: "email",
    label: "EMAIL",
    brand: "#EA4335",
    iconType: "logo",
    logoSrc: "/logos/gmail.svg",
    handle: "s.mathanbabu2007@gmail.com",
    href: "mailto:s.mathanbabu2007@gmail.com?subject=Portfolio%20enquiry",
    ariaLabel: "Send an email to s.mathanbabu2007@gmail.com",
    isExternal: false,
    copyable: true,
    copyValue: "s.mathanbabu2007@gmail.com",
  },
  {
    id: "phone",
    label: "PHONE",
    brand: "#b4c0ff",
    iconType: "lucide",
    handle: "+91 82701 52417",
    href: "tel:+918270152417",
    ariaLabel: "Call +91 82701 52417",
    isExternal: false,
    copyable: true,
    copyValue: "+918270152417",
  },
  {
    id: "linkedin",
    label: "LINKEDIN",
    brand: "#0A66C2",
    iconType: "logo",
    logoSrc: "/logos/linkedin.svg",
    handle: "mathan-babu-8331b1355",
    href: "https://www.linkedin.com/in/mathan-babu-8331b1355",
    ariaLabel: "Open Mathan's LinkedIn profile (opens in a new tab)",
    isExternal: true,
    copyable: false,
  },
  {
    id: "github",
    label: "GITHUB",
    brand: "#ffffff",
    iconType: "logo",
    logoSrc: "/logos/github.svg",
    handle: "Mathanbabu-07",
    href: "https://github.com/Mathanbabu-07",
    ariaLabel: "Open Mathan's GitHub profile (opens in a new tab)",
    isExternal: true,
    copyable: false,
  },
  {
    id: "instagram",
    label: "INSTAGRAM",
    brand: "#D62976",
    iconType: "logo",
    logoSrc: "/logos/instagram.svg",
    handle: "@mathanbabu218",
    href: "https://www.instagram.com/mathanbabu218/",
    ariaLabel: "Open Mathan's Instagram profile (opens in a new tab)",
    isExternal: true,
    copyable: false,
  },
];
