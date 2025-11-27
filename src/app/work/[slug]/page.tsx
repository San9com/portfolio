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
      "FiDB already delighted F1 obsessives with its depth. I reframed the journey so that organic race-week visitors glide toward subscription moments instead of bouncing after a single stat lookup.",
    phases: [
      {
        title: "Discover — where organic momentum leaks",
        body: [
          "Audited analytics, session replays, and support threads to understand how race weekend spikes failed to translate into sustained premium trials.",
          "Clustered high-intent search terms and App Store reviews, revealing that fans arrived for telemetry snapshots yet met a static paywall before they felt the value.",
        ],
        visuals: [
          {
            image: "/FiDB - Dark subscreen.png",
            alt: "Analytics dashboard showing race weekend traffic patterns and conversion drop-off points.",
          },
          {
            image: "/FiDB - Light standings.png",
            alt: "User journey map highlighting friction points before premium trial activation.",
          },
        ],
      },
      {
        title: "Define — conversion hypotheses that feel helpful",
        body: [
          "Established a value ladder that opens premium deltas inside free cards, so each upgrade prompt emerges inside the narrative of a race weekend.",
        ],
        visuals: [],
      },
      {
        title: "Design — a tile system built for upsell moments",
        body: [
          "Crafted a modular stat tile with live deltas, heroing what the subscription unlocks through subtle glass layers and motion affordances.",
        ],
        visuals: [],
      },
      {
        title: "Prepare — experiments before the next lights out",
        body: [
          "Outlined multi-variant experiments for trial wording, referral codes, and weekend-specific upgrade banners.",
        ],
        visuals: [],
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
          "Interviewed Apperium stakeholders about friction in today's wellness purchases and reframed products as guided rituals that adapt to energy, mood, and time of day.",
          "Segmented routines—recovery, focus, wind-down—into sensory cues that the app could anticipate with ambient sound, pacing, and reminders.",
        ],
        visuals: [
          {
            image: "/Case-Elvou-app-concept.png",
            alt: "Stakeholder interview insights and friction points in current wellness purchase flows.",
          },
          {
            image: "/elvou screen 2.png",
            alt: "Ritual segmentation framework showing recovery, focus, and wind-down routines.",
          },
        ],
      },
      {
        title: "Narrative architecture for guided commerce",
        body: [
          "Mapped flows where every product recommendation is introduced as a step in a breathing or movement ritual, reducing the feeling of being sold to.",
        ],
        visuals: [
          {
            image: "/elvou screen 3.png",
            alt: "Product recommendation flows integrated into breathing and movement rituals.",
          },
        ],
      },
      {
        title: "Pitch delivery with sensory storytelling",
        body: [
          "Packaged the concept into a sales deck that paired metrics (higher ritual completion, repeat orders) with emotive storytelling.",
        ],
        visuals: [],
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
          {
            image: "/Case-Iotspot.png",
            alt: "Corporate pilot listening session findings and pain points in desk finding workflows.",
          },
          {
            image: "/iotspot-iterations.png",
            alt: "Current experience benchmark metrics showing completion time and confidence levels.",
          },
        ],
      },
      {
        title: "Experience layer rebuilt from the map out",
        body: [
          "Switched the information architecture to start with interactive maps so context, availability, and etiquette live on one canvas.",
        ],
        visuals: [
          {
            image: "/images/project-iotspot.png",
            alt: "Interactive map interface design with context, availability, and etiquette on one canvas.",
          },
        ],
      },
      {
        title: "Launch prep for a smoother rollout",
        body: [
          "Partnered with engineering to translate the vision into a performant React Native build with budgets for sub-second pinch-zoom.",
        ],
        visuals: [],
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
          {
            image: "/Gaia Zoo - Pitch - Persona 1.jpg",
            alt: "Visitor journey maps showing navigation patterns and engagement drop-off points.",
          },
          {
            image: "/Gaia Zoo - Pitch - Affinity Map (Findings).jpg",
            alt: "Conservation messaging audit revealing missed opportunities for deeper connection.",
          },
        ],
      },
      {
        title: "Define",
        body: [
          "Designed adaptive map system that adjusts routes based on crowd density and visitor preferences.",
          "Created reward system that gamifies conservation learning, encouraging visitors to complete animal discovery challenges.",
        ],
        visuals: [
          {
            image: "/Gaia Zoo - Pitch - Feature prioritization matrix.jpg",
            alt: "Adaptive map interface showing dynamic routing based on real-time crowd data.",
          },
          {
            image: "/Gaia Zoo - Pitch - MoSCoW.jpg",
            alt: "Reward system design with conservation challenges and achievement unlocks.",
          },
        ],
      },
      {
        title: "Design",
        body: [
          "Built storytelling framework that weaves conservation facts into engaging narratives at each exhibit.",
          "Designed wayfinding system with clear visual hierarchy and accessibility features for all visitors.",
        ],
        visuals: [
          {
            image: "/GaiaZoo 2.webp",
            alt: "Conservation storytelling interface with narrative-driven content at each exhibit.",
          },
          {
            image: "/GaiaZoo 3.webp",
            alt: "Accessible wayfinding design with clear visual hierarchy and navigation cues.",
          },
        ],
      },
      {
        title: "Deliver",
        body: [
          "Launched companion app with real-time map updates and conservation challenge system.",
          "Measured increased visitor engagement with conservation content and improved navigation satisfaction scores.",
        ],
        visuals: [
          {
            image: "/GaiaZoo - summary.png",
            alt: "Final app interface showing real-time map updates and active challenges.",
          },
          {
            image: "/Gaiazoo 4.webp",
            alt: "Analytics dashboard displaying improved engagement metrics and visitor satisfaction.",
          },
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
          {
            image: "/Current - empathy map.png.webp",
            alt: "User research findings showing pain points in charger discovery and pricing transparency.",
          },
          {
            image: "/Current - value+proposition+canvas.webp",
            alt: "Journey maps highlighting friction in the charging experience from discovery to payment.",
          },
        ],
      },
      {
        title: "Define",
        body: [
          "Established design principles focused on clarity, trust, and convenience for EV drivers.",
          "Defined loyalty program structure that rewards frequent users while maintaining clear value proposition.",
        ],
        visuals: [
          {
            image: "/Current - low-fid.webp",
            alt: "Design principles framework and user experience goals for the charging companion.",
          },
          {
            image: "/Current 2.webp",
            alt: "Loyalty program structure and reward system design.",
          },
        ],
      },
      {
        title: "Design",
        body: [
          "Created intuitive wayfinding interface with real-time charger availability and clear pricing information.",
        ],
        visuals: [
          {
            image: "/Current - high-fid.webp",
            alt: "Wayfinding interface design with real-time availability and pricing transparency.",
          },
        ],
      },
      {
        title: "Deliver",
        body: [
          "Launched app with comprehensive charger network coverage and transparent pricing across all locations.",
        ],
        visuals: [
          {
            image: "/Current 2.webp",
            alt: "Final app interface showing comprehensive charger network and pricing information.",
          },
        ],
      },
    ],
  },
  "mkb-brandstof": {
    intro:
      "A digital transformation project for fuel management, streamlining operations and improving user experience for small and medium businesses in the fuel industry.",
    phases: [
      {
        title: "Discover",
        body: [
          "Conducted research with MKB Brandstof stakeholders to understand pain points in fuel management operations and identify opportunities for digital improvement.",
          "Analyzed current workflows and identified key friction points in order processing, inventory management, and customer communication.",
        ],
        visuals: [
          {
            image: "/MKB-Brandstof-1.png",
            alt: "Current workflow analysis highlighting friction points in order processing and inventory management.",
          },
        ],
      },
      {
        title: "Define",
        body: [
          "Established design principles focused on efficiency, clarity, and ease of use for fuel management operations.",
        ],
        visuals: [
          {
            image: "/MKB-Brandstof-Summary.png",
            alt: "Design principles framework and user experience goals for the fuel management platform.",
          },
        ],
      },
      {
        title: "Design",
        body: [
          "Created intuitive interface designs that simplify fuel order management and inventory tracking.",
        ],
        visuals: [],
      },
      {
        title: "Deliver",
        body: [
          "Launched the digital platform with comprehensive fuel management features and improved user workflows.",
        ],
        visuals: [],
      },
    ],
  },
  "stmpd-records": {
    intro:
      "Redesigning the digital experience for STMPD Records, creating a platform that showcases artists and connects fans with the music they love through an immersive, modern interface.",
    phases: [
      {
        title: "Discover",
        body: [
          "Researched the music label's brand identity and audience to understand how fans engage with electronic music labels.",
          "Analyzed competitor platforms and identified opportunities to create a unique digital experience that reflects STMPD's energy and creativity.",
        ],
        visuals: [
          {
            image: "/STMPD 1.png",
            alt: "Research findings showing brand identity analysis and fan engagement patterns with electronic music labels.",
          },
          {
            image: "/STMPD Artifacts.png",
            alt: "Competitive analysis and opportunity mapping for creating a unique digital music label experience.",
          },
        ],
      },
      {
        title: "Define",
        body: [
          "Established design principles that capture STMPD's bold, energetic brand while maintaining usability and accessibility.",
        ],
        visuals: [],
      },
      {
        title: "Design",
        body: [
          "Created immersive interface designs that showcase music releases with dynamic visuals and smooth interactions.",
        ],
        visuals: [],
      },
      {
        title: "Deliver",
        body: [
          "Launched the redesigned platform with enhanced artist showcases and improved fan engagement features.",
        ],
        visuals: [],
      },
    ],
  },
  "apperium-website-redesign": {
    intro:
      "A complete redesign of the Apperium website, creating a modern digital presence that reflects the agency's creative capabilities and client work through an immersive, portfolio-driven experience.",
    phases: [
      {
        title: "Discover",
        body: [
          "Analyzed the existing Apperium website to understand brand positioning and identify opportunities for a more compelling digital presence.",
          "Researched competitor agency websites and gathered insights on how creative agencies showcase their work and attract clients.",
        ],
        visuals: [
          {
            image: "/Apperium - website redesign 1.png",
            alt: "Analysis of existing Apperium website showing brand positioning and opportunities for improvement.",
          },
          {
            image: "/Apperium website redesign 2.png",
            alt: "Competitive research and insights on how creative agencies showcase their work effectively.",
          },
        ],
      },
      {
        title: "Define",
        body: [
          "Established design principles that balance creative expression with clear communication of services and capabilities.",
        ],
        visuals: [
          {
            image: "/Apperium website redesign 3.png",
            alt: "Design principles framework balancing creative expression with clear service communication.",
          },
        ],
      },
      {
        title: "Design",
        body: [
          "Created immersive homepage designs that showcase portfolio work with dynamic interactions and smooth transitions.",
        ],
        visuals: [],
      },
      {
        title: "Deliver",
        body: [
          "Launched the redesigned website with enhanced portfolio showcases and improved user experience.",
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

