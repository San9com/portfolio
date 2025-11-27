export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  summary: string;
  image?: string | null;
};

export const experience: ExperienceItem[] = [
  {
    id: "freelance-ios",
    role: "Freelance iOS designer",
    company: "Independent",
    start: "2018",
    end: "2022",
    summary: "Shipped dozens of crafted mobile experiences for founders and early teams, blending research with high-velocity execution.",
    image: null,
  },
  {
    id: "fontys",
    role: "Fontys University of Applied Sciences",
    company: "Student",
    start: "2022",
    end: "Today",
    summary: "Built a rigorous foundation in user-centered design, service blueprints, and experimentation with emerging motion languages.",
    image: null,
  },
  {
    id: "apperium",
    role: "UI/UX designer at Apperium",
    company: "Apperium",
    start: "2024",
    end: "2025",
    summary: "Partnered with clients like GaiaZoo and MKB Brandstof, translating strategy into lovable, measurable multi-platform journeys.",
    image: null,
  },
  {
    id: "stellar",
    role: "Startup owner",
    company: "Stellar Lab",
    start: "2024",
    end: "Today",
    summary: "Designer-founder of Stellar Lab, guiding product vision and building a warm, data-backed astrology companion for curious minds.",
    image: null,
  },
];

