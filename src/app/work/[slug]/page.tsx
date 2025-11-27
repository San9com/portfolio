import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { projects } from "@/data/projects";
import { CaseVisualShowcase } from "@/components/case/case-visual";

type CaseVisual = {
  image: string;
  alt: string;
};

type CasePhase = {
  title: string;
  body: string[];
  visuals: CaseVisual[];
};

type CaseContent = {
  intro?: string;
  phases: CasePhase[];
};

const caseContent: Record<string, CaseContent> = {
  "fidb-redesign": {
    intro:
      "FiDB already had loyal Formula One fans, organic downloads, and good data, yet it looked like something from 2018. The challenge was not to rebuild it but to help it catch up with the present.",
    phases: [
      {
        title: "An app stuck in an older world",
        body: [
          "FiDB already had loyal Formula One fans, organic downloads, and good data, yet it looked like something from 2018. The challenge was not to rebuild it but to help it catch up with the present.",
        ],
        visuals: [
          {
            image: "/FiDB - Dark subscreen.png",
            alt: "The original FiDB interface showing its dated design from 2018.",
          },
          {
            image: "/FiDB - Light standings.png",
            alt: "The app's existing features and loyal user base.",
          },
        ],
      },
      {
        title: "Sharper and more confident",
        body: [
          "We reviewed the entire flow, updated the visuals, and reorganized features so users could understand the value more quickly. Modernizing meant removing friction, not adding layers.",
        ],
        visuals: [],
      },
      {
        title: "Design that supports conversions",
        body: [
          "The redesign focused on clarity and trust, because people subscribe only when they feel grounded. Every decision centered around making that commitment easier.",
        ],
        visuals: [],
      },
      {
        title: "A quiet improvement",
        body: [
          "This project was not loud, it reshaped the app in subtle ways that made it feel fresh again, without losing its identity.",
        ],
        visuals: [],
      },
    ],
  },
  "elvou-app-concept": {
    intro:
      "Elvou sells products for health and wellbeing, from supplements to fitness accessories. Their physical brand was strong, but there was no digital space that matched their identity. That is where the Elevate Club concept was born.",
    phases: [
      {
        title: "A brand with potential waiting to be unlocked",
        body: [
          "Elvou sells products for health and wellbeing, from supplements to fitness accessories. Their physical brand was strong, but there was no digital space that matched their identity. That is where the Elevate Club concept was born.",
        ],
        visuals: [
          {
            image: "/Case-Elvou-app-concept.png",
            alt: "Elvou's physical brand identity and the gap in digital presence.",
          },
        ],
      },
      {
        title: "A companion rather than an app",
        body: [
          "The idea was to build a tracker that also hosted meditations, product browsing, and an Apple Health connection. Something that felt like the natural extension of their premium brand, not just a catalog of items.",
        ],
        visuals: [
          {
            image: "/elvou screen 2.png",
            alt: "The Elevate Club concept showing tracker, meditations, and product integration.",
          },
        ],
      },
      {
        title: "A calm and focused identity",
        body: [
          "The interface stays clean and soft, allowing the brand to breathe. No unnecessary shine, only a sense of balance that supports the user rather than distracts them.",
        ],
        visuals: [
          {
            image: "/elvou screen 3.png",
            alt: "Clean and soft interface design that reflects the brand's calm identity.",
          },
        ],
      },
      {
        title: "A concept worth pitching",
        body: [
          "The result gives Elvou a way to expand their presence and help customers experience more than just a product. It becomes a lifestyle they can actually feel.",
        ],
        visuals: [],
      },
    ],
  },
  "iotspot-case": {
    intro:
      "When I stepped into the world of iotSpot, the app felt like a busy hallway where everyone talked at once. Maps lived in one corner, lists lived in another, and users had to constantly switch perspectives just to understand where they were going. I knew people needed something calmer, something that guided them without asking for effort every time.",
    phases: [
      {
        title: "A quiet beginning",
        body: [
          "When I stepped into the world of iotSpot, the app felt like a busy hallway where everyone talked at once. Maps lived in one corner, lists lived in another, and users had to constantly switch perspectives just to understand where they were going. I knew people needed something calmer, something that guided them without asking for effort every time.",
        ],
        visuals: [
          {
            image: "/Case-Iotspot.png",
            alt: "The original iotSpot interface showing disconnected maps and lists.",
          },
        ],
      },
      {
        title: "Iteration as a habit",
        body: [
          "We moved through more than fifteen iterations, each one tested with real users, each one teaching us something new. I treated the process the way a craftsman treats a tool, returning to it again and again, polishing it until the edges made sense. Nothing rushed, nothing accidental.",
        ],
        visuals: [
          {
            image: "/iotspot-iterations.png",
            alt: "Evolution of design iterations showing the refinement process.",
          },
        ],
      },
      {
        title: "A floating idea that changed everything",
        body: [
          "The moment things shifted was when I introduced a floating navigation bar. It was simple, almost modest, but it solved an old problem in a new way. Switching between map and hierarchy finally felt natural. We added filters inside it too, a detail that looks small on a screen but changes how people experience a product.",
        ],
        visuals: [
          {
            image: "/images/project-iotspot.png",
            alt: "The floating navigation bar design that unified map and hierarchy views.",
          },
        ],
      },
      {
        title: "Design with a quieter confidence",
        body: [
          "IotSpot ended up reflecting how I think about design, structured, patient, almost meditative. It became cleaner, softer, more respectful of the people who depend on it during their workday.",
        ],
        visuals: [],
      },
    ],
  },
  "gaiazoo-companion": {
    intro:
      "GaiaZoo invited us to propose a new version of their app. Because I had worked on their previous product, I already knew what families loved, especially the map and the children's games. These small details gave me a direction before the work even began.",
    phases: [
      {
        title: "Breathing new life into a zoo",
        body: [
          "GaiaZoo invited us to propose a new version of their app. Because I had worked on their previous product, I already knew what families loved, especially the map and the children's games. These small details gave me a direction before the work even began.",
        ],
        visuals: [
          {
            image: "/Gaia Zoo - Pitch - Persona 1.jpg",
            alt: "Understanding what families loved from the previous app experience.",
          },
        ],
      },
      {
        title: "Research in the real world",
        body: [
          "We walked the paths of the Kerkrade zoo, studied reviews, watched how visitors planned their day, and listened to what frustrated them. The problem was not drama, it was clarity. People simply needed better guidance.",
        ],
        visuals: [
          {
            image: "/Gaia Zoo - Pitch - Affinity Map (Findings).jpg",
            alt: "Research findings from walking the zoo paths and studying visitor behavior.",
          },
          {
            image: "/Gaia Zoo - Pitch - Feature prioritization matrix.jpg",
            alt: "Analysis of visitor reviews and planning patterns.",
          },
        ],
      },
      {
        title: "Carrying the old into the new",
        body: [
          "We kept what worked, improved what felt outdated, modernized the visuals, and added features like Apple Wallet passes and smarter navigation. It felt like giving the zoo a new voice without erasing its character.",
        ],
        visuals: [
          {
            image: "/GaiaZoo 2.webp",
            alt: "Modernized visuals and new features like Apple Wallet integration.",
          },
          {
            image: "/GaiaZoo 3.webp",
            alt: "Improved navigation and wayfinding features.",
          },
        ],
      },
      {
        title: "A strong concept that finished second",
        body: [
          "We did not win the tender, a large agency did, yet our concept was praised and placed second. It remains one of the projects I am proud of, because it was built on empathy before anything else.",
        ],
        visuals: [
          {
            image: "/GaiaZoo - summary.png",
            alt: "The final concept presentation that placed second in the tender.",
          },
          {
            image: "/Gaiazoo 4.webp",
            alt: "Key features and design decisions that made the concept strong.",
          },
        ],
      },
    ],
  },
  "current-ev-charging-app": {
    intro:
      "Current EV is the project where I guided everything, from the first workshop to the final pixel. I followed a complete Double Diamond, with all its phases, all deliverables, all research sessions and testing rounds. The structure was not just a method, it was part of the story.",
    phases: [
      {
        title: "The project from the first step to the last",
        body: [
          "Current EV is the project where I guided everything, from the first workshop to the final pixel. I followed a complete Double Diamond, with all its phases, all deliverables, all research sessions and testing rounds. The structure was not just a method, it was part of the story.",
        ],
        visuals: [
          {
            image: "/Current - empathy map.png.webp",
            alt: "The complete design process from workshops to final design.",
          },
          {
            image: "/Current - value+proposition+canvas.webp",
            alt: "Design thinking phases and deliverables throughout the project.",
          },
        ],
      },
      {
        title: "Charging that listens to real life",
        body: [
          "This app was built to do more than charge a car. It predicts electricity prices, understands a user's schedule through Outlook, and chooses the best moment to start charging. Early meetings, late-night shifts, unexpected plans, everything becomes part of a smarter rhythm.",
        ],
        visuals: [
          {
            image: "/Current - low-fid.webp",
            alt: "Smart charging features that adapt to user schedules and electricity prices.",
          },
        ],
      },
      {
        title: "Workshops that shaped the outcome",
        body: [
          "I facilitated every workshop myself, making sure decisions grew from evidence. Nothing was added because it sounded exciting, everything was added because it made sense.",
        ],
        visuals: [
          {
            image: "/Current 2.webp",
            alt: "Workshop sessions and evidence-based decision making process.",
          },
        ],
      },
      {
        title: "A design that earns trust",
        body: [
          "The result is clear, calm, and reliable. The interface reflects the intelligence behind it, and every flow respects the user's time. It is one of those projects where structure becomes invisible, which is when you know it is working.",
        ],
        visuals: [
          {
            image: "/Current - high-fid.webp",
            alt: "The final interface design showing clarity, calm, and reliability.",
          },
        ],
      },
    ],
  },
  "mkb-brandstof": {
    intro:
      "Mkb Brandstof had lost trust in their previous development partner and invited several agencies to pitch. We ended up competing against some of the biggest names in the Netherlands, which made the challenge even more meaningful.",
    phases: [
      {
        title: "A client in search of clarity",
        body: [
          "Mkb Brandstof had lost trust in their previous development partner and invited several agencies to pitch. We ended up competing against some of the biggest names in the Netherlands, which made the challenge even more meaningful.",
        ],
        visuals: [
          {
            image: "/MKB-Brandstof-1.png",
            alt: "The challenge of competing against larger agencies in the pitch process.",
          },
        ],
      },
      {
        title: "Finding the real issue",
        body: [
          "Users constantly forgot whether a parking session was active, something that annoyed them and cost them money. The frustration was small but persistent, exactly the kind of problem worth solving.",
        ],
        visuals: [
          {
            image: "/MKB-Brandstof-Summary.png",
            alt: "User research showing the parking session confusion and its impact.",
          },
        ],
      },
      {
        title: "Live activities as a simple answer",
        body: [
          "I designed a Live Activities concept that showed everything at a glance, the timer, the location, the status. It made the whole experience feel calmer, almost effortless.",
        ],
        visuals: [],
      },
      {
        title: "A near win against large teams",
        body: [
          "We finished second because bigger agencies had bigger development capacity. The concept itself scored very high, and that validated the work more than winning the tender would have.",
        ],
        visuals: [],
      },
    ],
  },
  "stmpd-records": {
    intro:
      "Not many student teams are handed the chance to redesign the identity of the studio behind Martin Garrix. Stmpd Records is not just a label, it is a place where creative work breathes, where the city of Amsterdam becomes sound. Being chosen to rethink how such a space presents itself felt like a responsibility rather than a task.",
    phases: [
      {
        title: "A rare invitation",
        body: [
          "Not many student teams are handed the chance to redesign the identity of the studio behind Martin Garrix. Stmpd Records is not just a label, it is a place where creative work breathes, where the city of Amsterdam becomes sound. Being chosen to rethink how such a space presents itself felt like a responsibility rather than a task.",
        ],
        visuals: [
          {
            image: "/STMPD 1.png",
            alt: "The STMPD Records studio space and creative environment.",
          },
        ],
      },
      {
        title: "Searching for the true character",
        body: [
          "This was never about making something louder. Loud is easy. The challenge was to show the studio as something alive, a meeting point for artists, a place where collaboration is more important than the expensive gear around it.",
        ],
        visuals: [
          {
            image: "/STMPD Artifacts.png",
            alt: "Research and exploration of the studio's true character and collaborative spirit.",
          },
        ],
      },
      {
        title: "Building the concept",
        body: [
          "We researched, sketched, argued, explored tone and emotion, and slowly built a direction that felt honest. It treated the studio not as a brand but as a story, something you discover rather than something you are told.",
        ],
        visuals: [],
      },
      {
        title: "Still in motion",
        body: [
          "The project continues, and every week adds a new layer. It is the kind of work that reminds you why design matters, because it helps people see themselves more clearly.",
        ],
        visuals: [],
      },
    ],
  },
  "apperium-website-redesign": {
    intro:
      "This was the first major website redesign I led. It was for Apperium, the company where I first interned and later worked part-time. After their rebrand, they moved to a Squarespace site that I maintained, and over time I saw how many limitations it had.",
    phases: [
      {
        title: "A return to a familiar place",
        body: [
          "This was the first major website redesign I led. It was for Apperium, the company where I first interned and later worked part-time. After their rebrand, they moved to a Squarespace site that I maintained, and over time I saw how many limitations it had.",
        ],
        visuals: [
          {
            image: "/Apperium - website redesign 1.png",
            alt: "The original Squarespace site and its limitations.",
          },
        ],
      },
      {
        title: "Rebuilding from the foundation",
        body: [
          "I created a new style guide and visual identity, something futuristic and memorable, with a touch of Liquid Glass. It needed to stand out, to avoid the generic agency look that is so common in this industry.",
        ],
        visuals: [
          {
            image: "/Apperium website redesign 2.png",
            alt: "The new style guide and visual identity with Liquid Glass elements.",
          },
        ],
      },
      {
        title: "Iterating with intention",
        body: [
          "I designed everything in Figma, tested it internally, collected feedback, adjusted, refined, and only then moved on to development. Structure guided every step.",
        ],
        visuals: [
          {
            image: "/Apperium website redesign 3.png",
            alt: "The iterative design process in Figma with testing and refinement.",
          },
        ],
      },
      {
        title: "Bringing it to life on Framer",
        body: [
          "I rebuilt the site on Framer to keep it light and flexible. The final result is live, modern, and already receiving positive reactions.",
        ],
        visuals: [],
      },
    ],
  },
};

const defaultCaseContent: CaseContent = {
  phases: [
    {
      title: "Discover",
      body: [
        "Research and discovery phase to understand user needs and project requirements.",
        "Analysis of existing solutions and identification of opportunities for improvement.",
      ],
      visuals: [
        {
          image: "/images/project-stellar.png",
          alt: "User research findings and discovery insights.",
        },
        {
          image: "/images/project-stellar.png",
          alt: "Competitive analysis and opportunity mapping.",
        },
      ],
    },
    {
      title: "Design",
      body: [
        "Design phase focusing on creating intuitive and effective user experiences.",
        "Iterative design process with user testing and feedback integration.",
      ],
      visuals: [
        {
          image: "/images/project-stellar.png",
          alt: "Design concepts and user interface explorations.",
        },
        {
          image: "/images/project-stellar.png",
          alt: "Final design solutions and implementation details.",
        },
      ],
    },
  ],
};

function CaseImage({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0a]">
      <div className="relative mx-auto w-full" style={{ maxWidth: "min(100%, 1400px)" }}>
        <Image
          src={image}
          alt={alt}
          width={1400}
          height={1400}
          className="h-auto w-full object-contain"
          style={{ 
            maxWidth: "100%", 
            height: "auto",
            display: "block"
          }}
          sizes="(max-width: 1400px) 100vw, 1400px"
        />
      </div>
    </div>
  );
}

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug.toLowerCase() }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();
  const project = projects.find((item) => item.slug.toLowerCase() === normalizedSlug);

  if (!project) {
    return {
      title: "Case not found",
    };
  }

  return {
    title: `${project.title} · Case Study`,
    description: project.description,
  };
}

export default async function WorkCasePage({ params }: WorkPageProps) {
  const { slug } = await params;
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();
  const project = projects.find((item) => item.slug.toLowerCase() === normalizedSlug);

  if (!project) {
    notFound();
  }

  const content = caseContent[project.slug] ?? defaultCaseContent;

  return (
    <>
      <main className="bg-black text-foreground">
        <Header overlay />
        <article className="mx-auto flex w-full flex-col">
          <CaseVisualShowcase 
            image={project.image} 
            alt={`${project.title} hero visual`} 
            brightness={project.slug === "apperium-website-redesign" ? 1.02 : 1}
          />
          <section className="w-full bg-black px-6 pb-32 pt-16 sm:px-10 sm:pt-24 lg:px-16">
            <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-16">
              <div className="flex items-center justify-between gap-8 text-foreground">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-normal tracking-wider text-foreground/60 transition-colors hover:text-foreground"
                >
                  ← Back home
                </Link>
              </div>

              {/* Hero Section - Matches reference style */}
              <div className="flex flex-col gap-8 text-foreground lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                <div className="flex flex-col gap-6 lg:flex-1">
                  <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] tracking-tight">
                    {project.title}
                  </h1>
                  {content.intro ? (
                    <p className="max-w-2xl text-base leading-[1.7] text-white/65">{content.intro}</p>
                  ) : null}
                </div>
                <span className="text-[clamp(2rem,3.5vw,3rem)] font-light leading-none text-foreground/70 lg:pt-2">
                  {project.year}
                </span>
              </div>

              {/* Content Phases */}
              <div className="flex flex-col gap-24 pt-8 lg:gap-32">
                {content.phases.map((phase, phaseIndex) => (
                  <section key={`${project.slug}-${phase.title}`} className="flex flex-col gap-16">
                    <div className="space-y-6">
                      <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-tight text-foreground">
                        {phase.title}
                      </h2>
                      <div className="max-w-3xl space-y-5 text-base leading-[1.7] text-white/60">
                        {phase.body.map((paragraph, index) => (
                          <p key={`${phase.title}-body-${index}`}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    
                    {/* Full-width visuals section */}
                    <div className="flex flex-col gap-6">
                      {phase.visuals
                        .filter((visual) => visual.image !== project.image)
                        .map((visual, index, filteredVisuals) => {
                          const isLastTwo = filteredVisuals.length >= 2 && index >= filteredVisuals.length - 2;
                          const isEvenInLastTwo = isLastTwo && (index - (filteredVisuals.length - 2)) % 2 === 0;
                          const nextIsAlsoLast = isLastTwo && index < filteredVisuals.length - 1;
                        
                        // If this is the first of the last two items, render both in a grid
                        if (isEvenInLastTwo && nextIsAlsoLast) {
                            const nextVisual = filteredVisuals[index + 1];
                          return (
                            <div key={`${phase.title}-visual-grid-${index}`} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <CaseImage image={visual.image} alt={visual.alt} />
                                <CaseImage image={nextVisual.image} alt={nextVisual.alt} />
                            </div>
                          );
                        }
                        
                        // Skip if this was already rendered as part of the grid
                        if (isLastTwo && !isEvenInLastTwo) {
                          return null;
                        }
                        
                        // Render single full-width visual
                          return <CaseImage key={`${phase.title}-visual-${index}`} image={visual.image} alt={visual.alt} />;
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

