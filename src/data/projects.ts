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
      "Repositioning the beloved F1 stats companion to convert organic race-week traffic into subscription momentum.",
    image: "/FiDB - Dark subscreen.png",
    slug: "fidb-redesign",
    accent: "#a8b4ff",
  },
  {
    id: "elvou",
    year: "2025",
    title: "Elvou App Concept",
    description:
      "A ritual-led wellness pitch where every product becomes part of a guided routine, crafted as a sales narrative for Apperium.",
    image: "/Case-Elvou-app-concept.png",
    slug: "elvou-app-concept",
    accent: "#b6c5ff",
  },
  {
    id: "iotspot",
    year: "2024",
    title: "iotSpot",
    description:
      "A ground-up rethink of the hybrid workplace app with new maps, faster flows, and guidance that removes guesswork.",
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
    id: "current",
    year: "2024",
    title: "Current EV Charging App",
    description:
      "An EV charging companion structured around design thinking sprints for wayfinding, pricing clarity, and loyalty loops.",
    image: "/images/project-stellar.png",
    slug: "current-ev-charging-app",
    accent: "#ef92c2",
  },
  {
    id: "mkb-brandstof",
    year: "2024",
    title: "MKB Brandstof",
    description:
      "A digital transformation project for fuel management, streamlining operations and improving user experience for small and medium businesses.",
    image: "/Case-MKB-Brandstof.png",
    slug: "mkb-brandstof",
    accent: "#ffa85c",
  },
  {
    id: "stmpd",
    year: "2025-2026",
    title: "STMPD Records",
    description:
      "Redesigning the digital experience for STMPD Records, creating a platform that showcases artists and connects fans with the music they love.",
    image: "/STMPD 1.png",
    slug: "stmpd-records",
    accent: "#8b5cf6",
  },
  {
    id: "apperium-website",
    year: "2025",
    title: "Apperium Website Redesign",
    description:
      "A complete redesign of the Apperium website, creating a modern digital presence that reflects the agency's creative capabilities and client work.",
    image: "/Apperium - website redesign 1.png",
    slug: "apperium-website-redesign",
    accent: "#6b9fff",
  },
];

