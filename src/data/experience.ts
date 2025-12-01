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
    role: "Freelance UI/UX designer (iOS)",
    company: "Independent",
    start: "February 2020",
    end: "Early 2022",
    summary: "During those years, I worked on a dozen of iOS applications ranging from VPNs to Meditation applications. I was responsible for the whole design starting with onboarding screen and ending up with App Store graphics, icons and logos. During the fall of 2022, a small team consisting of a developer, an investor, and I created a QR-code scanner application in which I had a stake. As both the UI/UX designer and product manager, I was responsible for the entire product lifecycle from the initial ideation and competitive analysis to later handling things like A/B testing of the finished product. The application, though not financially successful, was later sold to another company.",
    image: null,
  },
  {
    id: "fontys",
    role: "Fontys University of Applied Sciences",
    company: "Student",
    start: "2022",
    end: "Today",
    summary: "Spent university years learning the core ideas of a user-centered design and what being in the user's shoes even means.",
    image: null,
  },
  {
    id: "stellar",
    role: "UI/UX & Product designer for Stellar Lab (side project)",
    company: "Stellar Lab",
    start: "April 2024",
    end: "August 2025",
    summary: "Stellar Lab has started as an AR Kit experiment of my mine and turned out a full scale astrology (yes, a more profitable niche than astronomy) with paid traffic. This has been a terrific experience both in terms of managing a full scale app project and closely working with a team of developer, marketer, senior designer and a few motion designers.",
    image: null,
  },
  {
    id: "apperium",
    role: "UI/UX designer at Apperium",
    company: "Apperium",
    start: "September 2024",
    end: "Today",
    summary: "At Apperium, I have contributed to the transformation of a company that primarily develops applications into one that manages all the touchpoints. Brought their design process to an agency standard. Took the lead in shaping their identity. I've led lots and lots of client projects and have contributed significantly to major money-making ones.",
    image: null,
  },
];

