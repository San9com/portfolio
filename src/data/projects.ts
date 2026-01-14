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
    title: "FiDB Redesign",
    description:
      "I redesigned FiDB to turn race-week traffic into something people actually return to. Calm data, quick answers.",
    image: "/FiDB - Dark subscreen.png",
    slug: "fidb-redesign",
    accent: "#a8b4ff",
  },
  {
    id: "elvou",
    year: "2025",
    title: "Elvou App Concept",
    description:
      "A wellness concept built around ritual. The interface guides you without shouting.",
    image: "/Case-Elvou-app-concept.png",
    slug: "elvou-app-concept",
    accent: "#b6c5ff",
  },
  {
    id: "iotspot",
    year: "2024",
    title: "iotSpot",
    description:
      "A rethink of the hybrid workplace experience: clearer maps, faster flows, less second-guessing.",
    image: "/images/project-iotspot.png",
    slug: "iotspot-case",
    accent: "#f6c58f",
  },
  {
    id: "gaiazoo",
    year: "2024",
    title: "GaiaZoo Companion",
    description:
      "A companion for a day at the zoo. Navigation, storytelling, and small moments that make you care.",
    image: "/images/project-gaiazoo.png",
    slug: "gaiazoo-companion",
    accent: "#9ccdc4",
  },
  {
    id: "current",
    year: "2024",
    title: "Current EV Charging App",
    description:
      "An EV charging app that removes friction. Pricing is clearer, choices are simpler, next steps are obvious.",
    image: "/images/project-stellar.png",
    slug: "current-ev-charging-app",
    accent: "#ef92c2",
  },
  {
    id: "mkb-brandstof",
    year: "2024",
    title: "MKB Brandstof",
    description:
      "Fuel management, simplified. Less admin, fewer mistakes, more control for the people running the day.",
    image: "/Case-MKB-Brandstof.png",
    slug: "mkb-brandstof",
    accent: "#ffa85c",
  },
  {
    id: "stmpd",
    year: "2025-2026",
    title: "STMPD Records",
    description:
      "A redesign for STMPD that puts the artists first and keeps everything else out of the way.",
    image: "/STMPD 1.png",
    slug: "stmpd-records",
    accent: "#8b5cf6",
  },
  {
    id: "apperium-website",
    year: "2025",
    title: "Apperium Website Redesign",
    description:
      "A full website redesign for Apperium: sharper story, stronger presence, and a vibe that finally matches the work.",
    image: "/Apperium - website redesign 1.png",
    slug: "apperium-website-redesign",
    accent: "#6b9fff",
  },
];

