import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { projects } from "@/data/projects";
import { CaseVisualShowcase } from "@/components/case/case-visual";

type CasePhase = {
  title: string;
  body: string[];
  visuals: string[];
};

type CaseContent = {
  intro?: string;
  phases: CasePhase[];
};

const caseContent: Record<string, CaseContent> = {
  "fidb-redesign": {
    intro:
      "FiDB already delighted F1 obsessives with its depth. I reframed the journey so that organic race-week visitors glide toward subscription moments instead of bouncing after a single stat lookup.",
    phases: [
      {
        title: "Discover — where organic momentum leaks",
        body: [
          "Audited analytics, session replays, and support threads to understand how race weekend spikes failed to translate into sustained premium trials.",
          "Clustered high-intent search terms and App Store reviews, revealing that fans arrived for telemetry snapshots yet met a static paywall before they felt the value.",
        ],
        visuals: [
          "Analytics dashboard showing race weekend traffic patterns and conversion drop-off points.",
          "User journey map highlighting friction points before premium trial activation.",
        ],
      },
      {
        title: "Define — conversion hypotheses that feel helpful",
        body: [
          "Established a value ladder that opens premium deltas inside free cards, so each upgrade prompt emerges inside the narrative of a race weekend.",
          "Reordered navigation around ‘Weekend story, Driver duel, Season arc’ so fans feel guided rather than siloed into features.",
        ],
        visuals: [
          "Value ladder visualization showing premium features integrated into free content.",
          "Navigation restructure with Weekend story, Driver duel, and Season arc sections.",
        ],
      },
      {
        title: "Design — a tile system built for upsell moments",
        body: [
          "Crafted a modular stat tile with live deltas, heroing what the subscription unlocks through subtle glass layers and motion affordances.",
          "Reimagined onboarding into a three-step warm-up with social proof, driver spotlights, and calendar hooks leading toward trial activation.",
        ],
        visuals: [
          "Modular stat tile design with live deltas and glass layer effects showcasing premium features.",
          "Three-step onboarding flow with social proof, driver spotlights, and calendar integration.",
        ],
      },
      {
        title: "Prepare — experiments before the next lights out",
        body: [
          "Outlined multi-variant experiments for trial wording, referral codes, and weekend-specific upgrade banners.",
          "Partnered with marketing on a race-week content cadence so organic spikes in traffic route directly into the new upgrade loops.",
        ],
        visuals: [
          "Multi-variant experiment designs for trial wording and referral code placement.",
          "Race-week content calendar and upgrade banner designs for marketing integration.",
        ],
      },
    ],
  },
  "elvou-app-concept": {
    intro:
      "Elvou doesn’t just sell wellness products — it curates them as part of personalised rituals that support body and mind. We positioned the concept as a sales pitch for Apperium, proving how soundscapes, magnesium mixes, and breathing sprays could feel orchestrated instead of transactional.",
    phases: [
      {
        title: "Immersion in daily rituals",
        body: [
          "Interviewed Apperium stakeholders about friction in today’s wellness purchases and reframed products as guided rituals that adapt to energy, mood, and time of day.",
          "Segmented routines—recovery, focus, wind-down—into sensory cues that the app could anticipate with ambient sound, pacing, and reminders.",
        ],
        visuals: [
          "Stakeholder interview insights and friction points in current wellness purchase flows.",
          "Ritual segmentation framework showing recovery, focus, and wind-down routines.",
        ],
      },
      {
        title: "Narrative architecture for guided commerce",
        body: [
          "Mapped flows where every product recommendation is introduced as a step in a breathing or movement ritual, reducing the feeling of being sold to.",
          "Built a bilingual microcopy matrix to keep the tone soft, reassuring, and consultative across Dutch and English surfaces.",
        ],
        visuals: [
          "Product recommendation flows integrated into breathing and movement rituals.",
          "Bilingual microcopy matrix for Dutch and English with consultative tone guidelines.",
        ],
      },
      {
        title: "Pitch delivery with sensory storytelling",
        body: [
          "Packaged the concept into a sales deck that paired metrics (higher ritual completion, repeat orders) with emotive storytelling.",
          "Presented an interactive prototype with subtle parallax, allowing stakeholders to sense how rituals would evolve with each purchase.",
        ],
        visuals: [
          "Sales deck design pairing metrics with emotive storytelling for stakeholder presentation.",
          "Interactive prototype with subtle parallax effects showing ritual evolution with purchases.",
        ],
      },
    ],
  },
  "iotspot-case": {
    intro:
      "The new iotspot app is almost here. We reimagined every tap so hybrid workers can find the right desk, teammates, or room without guesswork — all while running faster than the legacy build.",
    phases: [
      {
        title: "Groundwork with hybrid teams",
        body: [
          "Ran listening sessions with corporate pilots to surface the moments when finding a spot felt like a chore, from Monday rush hours to ad-hoc war rooms.",
          "Benchmarked the current experience, measuring completion time and confidence to establish a clear baseline for the redesign.",
        ],
        visuals: [
          "Corporate pilot listening session findings and pain points in desk finding workflows.",
          "Current experience benchmark metrics showing completion time and confidence levels.",
        ],
      },
      {
        title: "Experience layer rebuilt from the map out",
        body: [
          "Switched the information architecture to start with interactive maps so context, availability, and etiquette live on one canvas.",
          "Designed teammate locator microinteractions and predictive search chips that surface likely choices before users ask.",
        ],
        visuals: [
          "Interactive map interface design with context, availability, and etiquette on one canvas.",
          "Teammate locator microinteractions and predictive search chip designs.",
        ],
      },
      {
        title: "Launch prep for a smoother rollout",
        body: [
          "Partnered with engineering to translate the vision into a performant React Native build with budgets for sub-second pinch-zoom.",
          "Co-wrote the ‘sneak peek’ campaign with product marketing, showcasing visuals that mirror the new navigation flow.",
        ],
        visuals: [
          "React Native build architecture with performance budgets for sub-second pinch-zoom.",
          "Sneak peek campaign visuals mirroring the new navigation flow for product marketing.",
        ],
      },
    ],
  },
  "gaiazoo-companion": {
    intro:
      "Reimagining a day at the zoo with adaptive maps, conservation storytelling, and rewards that deepen empathy for wildlife and their habitats.",
    phases: [
      {
        title: "Discover",
        body: [
          "Conducted visitor research to understand how families navigate the zoo and where they lose engagement with conservation messaging.",
          "Mapped pain points in wayfinding, especially during peak hours when visitors struggle to find exhibits and facilities.",
        ],
        visuals: [
          "Visitor journey maps showing navigation patterns and engagement drop-off points.",
          "Conservation messaging audit revealing missed opportunities for deeper connection.",
        ],
      },
      {
        title: "Define",
        body: [
          "Designed adaptive map system that adjusts routes based on crowd density and visitor preferences.",
          "Created reward system that gamifies conservation learning, encouraging visitors to complete animal discovery challenges.",
        ],
        visuals: [
          "Adaptive map interface showing dynamic routing based on real-time crowd data.",
          "Reward system design with conservation challenges and achievement unlocks.",
        ],
      },
      {
        title: "Design",
        body: [
          "Built storytelling framework that weaves conservation facts into engaging narratives at each exhibit.",
          "Designed wayfinding system with clear visual hierarchy and accessibility features for all visitors.",
        ],
        visuals: [
          "Conservation storytelling interface with narrative-driven content at each exhibit.",
          "Accessible wayfinding design with clear visual hierarchy and navigation cues.",
        ],
      },
      {
        title: "Deliver",
        body: [
          "Launched companion app with real-time map updates and conservation challenge system.",
          "Measured increased visitor engagement with conservation content and improved navigation satisfaction scores.",
        ],
        visuals: [
          "Final app interface showing real-time map updates and active challenges.",
          "Analytics dashboard displaying improved engagement metrics and visitor satisfaction.",
        ],
      },
    ],
  },
  "current-ev-charging-app": {
    intro:
      "An EV charging companion structured around design thinking sprints for wayfinding, pricing clarity, and loyalty loops that make charging seamless.",
      phases: [
      {
        title: "Discover",
        body: [
          "Researched EV driver pain points around finding available chargers, understanding pricing, and managing charging sessions.",
          "Identified key friction points in wayfinding and the lack of transparency in pricing structures across different networks.",
        ],
        visuals: [
          "User research findings showing pain points in charger discovery and pricing transparency.",
          "Journey maps highlighting friction in the charging experience from discovery to payment.",
        ],
      },
      {
        title: "Define",
        body: [
          "Established design principles focused on clarity, trust, and convenience for EV drivers.",
          "Defined loyalty program structure that rewards frequent users while maintaining clear value proposition.",
        ],
        visuals: [
          "Design principles framework and user experience goals for the charging companion.",
          "Loyalty program structure and reward system design.",
        ],
      },
      {
        title: "Design",
        body: [
          "Created intuitive wayfinding interface with real-time charger availability and clear pricing information.",
          "Designed seamless payment flow and loyalty program integration that rewards consistent usage.",
        ],
        visuals: [
          "Wayfinding interface design with real-time availability and pricing transparency.",
          "Payment flow and loyalty program integration showing reward accumulation.",
        ],
      },
      {
        title: "Deliver",
        body: [
          "Launched app with comprehensive charger network coverage and transparent pricing across all locations.",
          "Achieved high user satisfaction scores for wayfinding clarity and loyalty program engagement.",
        ],
        visuals: [
          "Final app interface showing comprehensive charger network and pricing information.",
          "Analytics dashboard displaying user satisfaction metrics and loyalty program engagement.",
        ],
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
        "User research findings and discovery insights.",
        "Competitive analysis and opportunity mapping.",
      ],
    },
    {
      title: "Design",
      body: [
        "Design phase focusing on creating intuitive and effective user experiences.",
        "Iterative design process with user testing and feedback integration.",
      ],
      visuals: [
        "Design concepts and user interface explorations.",
        "Final design solutions and implementation details.",
      ],
    },
  ],
};

function CaseImage({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a0a]">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
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
          <CaseVisualShowcase image={project.image} alt={`${project.title} hero visual`} />
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
                      {phase.visuals.map((label, index) => {
                        const isLastTwo = phase.visuals.length >= 2 && index >= phase.visuals.length - 2;
                        const isEvenInLastTwo = isLastTwo && (index - (phase.visuals.length - 2)) % 2 === 0;
                        const nextIsAlsoLast = isLastTwo && index < phase.visuals.length - 1;
                        
                        // If this is the first of the last two items, render both in a grid
                        if (isEvenInLastTwo && nextIsAlsoLast) {
                          return (
                            <div key={`${phase.title}-visual-grid-${index}`} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                              <CaseImage image={project.image} alt={`${project.title} - ${label}`} />
                              <CaseImage image={project.image} alt={`${project.title} - ${phase.visuals[index + 1]}`} />
                            </div>
                          );
                        }
                        
                        // Skip if this was already rendered as part of the grid
                        if (isLastTwo && !isEvenInLastTwo) {
                          return null;
                        }
                        
                        // Render single full-width visual
                        return <CaseImage key={`${phase.title}-visual-${index}`} image={project.image} alt={`${project.title} - ${label}`} />;
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

