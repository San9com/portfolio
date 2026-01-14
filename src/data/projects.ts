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
      "Turning race-week attention into a habit — where data feels calm, not noisy.",
    image: "/FiDB - Dark subscreen.png",
    slug: "fidb-redesign",
    accent: "#a8b4ff",
  },
  {
    id: "elvou",
    year: "2025",
    title: "Elvou App Concept",
    description:
      "A ritual as interface — products arranged into a routine that feels inevitable.",
    image: "/Case-Elvou-app-concept.png",
    slug: "elvou-app-concept",
    accent: "#b6c5ff",
  },
  {
    id: "iotspot",
    year: "2024",
    title: "iotSpot",
    description:
      "A workplace that explains itself — maps and flows that remove hesitation.",
    image: "/images/project-iotspot.png",
    slug: "iotspot-case",
    accent: "#f6c58f",
  },
  {
    id: "gaiazoo",
    year: "2024",
    title: "GaiaZoo Companion",
    description:
      "A day at the zoo, guided by curiosity — where navigation becomes care.",
    image: "/images/project-gaiazoo.png",
    slug: "gaiazoo-companion",
    accent: "#9ccdc4",
  },
  {
    id: "current",
    year: "2024",
    title: "Current EV Charging App",
    description:
      "Charging without friction — clarity in pricing, direction, and next steps.",
    image: "/images/project-stellar.png",
    slug: "current-ev-charging-app",
    accent: "#ef92c2",
  },
  {
    id: "mkb-brandstof",
    year: "2024",
    title: "MKB Brandstof",
    description:
      "Operational work, made quiet — fewer steps, fewer mistakes, more control.",
    image: "/Case-MKB-Brandstof.png",
    slug: "mkb-brandstof",
    accent: "#ffa85c",
  },
  {
    id: "stmpd",
    year: "2025-2026",
    title: "STMPD Records",
    description:
      "A label’s world in motion — artists first, friction last.",
    image: "/STMPD 1.png",
    slug: "stmpd-records",
    accent: "#8b5cf6",
  },
  {
    id: "apperium-website",
    year: "2025",
    title: "Apperium Website Redesign",
    description:
      "A digital presence that feels like conviction — sharp, liquid, unmistakable.",
    image: "/Apperium - website redesign 1.png",
    slug: "apperium-website-redesign",
    accent: "#6b9fff",
  },
];

