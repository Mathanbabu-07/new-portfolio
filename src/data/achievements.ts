export interface Achievement {
  id: string;
  title: string;
  shortTitle: string;
  org: string;
  badges: string[];
  icon: 'Award' | 'Trophy' | 'Medal';
  image: string;
  alt: string;
  desc: string;
  focusX: number;
}

export interface EducationItem {
  id: string;
  kind: 'College' | 'School';
  headline: string;
  institution?: string;
  location: string;
  icon: 'GraduationCap' | 'School';
}

export const achievementsSectionData = {
  label: "ACHIEVEMENTS",
  heading: "Achievements & Education",
  subtitle:
    "Recognitions from hackathons, symposiums and campus honours, along with my academic background.",
};

export const achievements: Achievement[] = [
  {
    id: "best-student",
    title: "Best Student Award 2024–2025",
    shortTitle: "Best Student",
    org: "Sethu Institute of Technology",
    badges: ["Award"],
    icon: "Award",
    focusX: 0.5,
    image: "/achievements/best-student",
    alt: "Receiving an award on stage at Sethu Institute of Technology",
    desc: "Honored with the Best Student Award at Sethu Institute of Technology. This recognition reflects a continuous dedication to academic excellence and an active, positive contribution to the campus community.",
  },
  {
    id: "tarcin-hackathon",
    title: "Double Win at Tarcin Robotics 10-Day Python Hackathon",
    shortTitle: "Python Hackathon",
    org: "Tarcin Robotics",
    badges: ["1st Place · Team", "3rd Place · Individual"],
    icon: "Trophy",
    focusX: 0.4,
    image: "/achievements/tarcin-hackathon",
    alt: "Team receiving the winners' plaque and medals",
    desc: "Secured 1st Place in the Team Category (Team No Mercy) and 3rd Place in the Individual Category. Navigated complex Python puzzles, demonstrating strong collaboration, logic, and computational thinking skills in a high-pressure environment.",
  },
  {
    id: "aicci-summit",
    title: "Top 20 Finalists among 1,000+ Teams",
    shortTitle: "AICCI Top 20",
    org: "AICCI National Summit 2026 Finals, Thoothukudi",
    badges: ["Top 20 of 1,000+"],
    icon: "Medal",
    focusX: 0.52,
    image: "/achievements/aicci-summit",
    alt: "Team at the AICCI National Startup Summit 2026 in Thoothukudi",
    desc: "Huge milestone for our team and a great learning experience. The journey taught us valuable lessons in innovation, teamwork, presentation, and building solutions for real-world problems.",
  },
  {
    id: "codesprint",
    title: "2nd Prize at CodeSprint Pro",
    shortTitle: "CodeSprint Pro",
    org: "Mangayarkarasi College of Engineering",
    badges: ["2nd Prize"],
    icon: "Medal",
    focusX: 0.42,
    image: "/achievements/codesprint",
    alt: "Receiving the CodeSprint Pro prize and certificate",
    desc: "Secured 2nd Prize in the CodeSprint Pro Coding Competition at Mangayarkarasi College of Engineering. Showcased sharp problem-solving abilities and competitive programming skills among talented peers.",
  },
  {
    id: "hexaivita",
    title: "1st Prize at Hexaivita National Symposium",
    shortTitle: "Hexaivita",
    org: "SERB Symposium Hexaivita, Sethu Institute of Technology",
    badges: ["1st Prize"],
    icon: "Trophy",
    focusX: 0.5,
    image: "/achievements/hexaivita",
    alt: "Receiving the Hexaivita first prize certificate",
    desc: "Won 1st Prize in the national-level coding competition at the SERB Symposium Hexaivita, organized by Sethu Institute of Technology.",
  },
];

export const educationItems: EducationItem[] = [
  {
    id: "college",
    kind: "College",
    headline: "B.Tech Information Technology",
    institution: "Sethu Institute of Technology",
    location: "Virudhunagar",
    icon: "GraduationCap",
  },
  {
    id: "school",
    kind: "School",
    headline: "Don Bosco Hr.Sec.School",
    location: "Madurai",
    icon: "School",
  },
];
