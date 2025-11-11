export type Project = {
  id: string;
  year: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  accent: string;
};

export const projects: Project[] = [
  {
    id: "fidb",
    year: "2025",
    title: "FIDB Mobile Banking",
    description:
      "Reshaping FIDB’s digital bank into a calmer, human experience—rapid balance insights up front, contextual wealth nudges, and automation that feels personal.",
    image: "/Case-fidb.png",
    slug: "fidb-mobile-banking",
    accent: "#a8b4ff",
  },
  {
    id: "elvou",
    year: "2025",
    title: "Elvou App Concept",
    description:
      "Crafting a wellness companion that pairs restorative soundscapes with predictive rituals to ease decision fatigue throughout the day.",
    image: "/Case-Elvou-app-concept.png",
    slug: "elvou-app-concept",
    accent: "#b6c5ff",
  },
  {
    id: "iotspot",
    year: "2024",
    title: "iotSpot",
    description:
      "A double-diamond discovery that transformed charging friction into a seamless, anticipatory flow for urban EV drivers.",
    image: "/images/project-iotspot.png",
    slug: "iotspot-case",
    accent: "#f6c58f",
  },
  {
    id: "gaiazoo",
    year: "2024",
    title: "GaiaZoo Companion",
    description:
      "Reimagining a day at the zoo with adaptive maps, conservation storytelling, and rewards that deepen empathy.",
    image: "/images/project-gaiazoo.png",
    slug: "gaiazoo-companion",
    accent: "#9ccdc4",
  },
  {
    id: "stellar",
    year: "2025",
    title: "Stellar Lab",
    description:
      "A mindful astrology guide that balances depth with clarity, built around daily rituals and calm visual narratives.",
    image: "/images/project-stellar.png",
    slug: "stellar-lab",
    accent: "#ef92c2",
  },
];

