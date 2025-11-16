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
    image: "/Case-fidb.png",
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
    year: "2025",
    title: "Current EV Charging App",
    description:
      "An EV charging companion structured around design thinking sprints for wayfinding, pricing clarity, and loyalty loops.",
    image: "/images/project-stellar.png",
    slug: "current-ev-charging-app",
    accent: "#ef92c2",
  },
];

