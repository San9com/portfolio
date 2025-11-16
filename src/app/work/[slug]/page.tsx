import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { projects } from "@/data/projects";

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
          "Visual placeholder · Conversion telemetry board highlighting qualifying drop-offs",
          "Visual placeholder · Organic search clusters mapped to the 24-race calendar",
        ],
      },
      {
        title: "Define — conversion hypotheses that feel helpful",
        body: [
          "Established a value ladder that opens premium deltas inside free cards, so each upgrade prompt emerges inside the narrative of a race weekend.",
          "Reordered navigation around ‘Weekend story, Driver duel, Season arc’ so fans feel guided rather than siloed into features.",
        ],
        visuals: [
          "Visual placeholder · Value ladder canvas aligning feature tiers to prompts",
          "Visual placeholder · Story-first navigation sketches",
        ],
      },
      {
        title: "Design — a tile system built for upsell moments",
        body: [
          "Crafted a modular stat tile with live deltas, heroing what the subscription unlocks through subtle glass layers and motion affordances.",
          "Reimagined onboarding into a three-step warm-up with social proof, driver spotlights, and calendar hooks leading toward trial activation.",
        ],
        visuals: [
          "Visual placeholder · Component sheet of premium stat tiles",
          "Visual placeholder · Onboarding sprint storyboard",
        ],
      },
      {
        title: "Prepare — experiments before the next lights out",
        body: [
          "Outlined multi-variant experiments for trial wording, referral codes, and weekend-specific upgrade banners.",
          "Partnered with marketing on a race-week content cadence so organic spikes in traffic route directly into the new upgrade loops.",
        ],
        visuals: [
          "Visual placeholder · Experiment roadmap timeline",
          "Visual placeholder · Launch playbook snapshots",
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
          "Visual placeholder · Ritual mood collage weaving sound, light, and texture",
          "Visual placeholder · Persona routine cards for recovery and calm modes",
        ],
      },
      {
        title: "Narrative architecture for guided commerce",
        body: [
          "Mapped flows where every product recommendation is introduced as a step in a breathing or movement ritual, reducing the feeling of being sold to.",
          "Built a bilingual microcopy matrix to keep the tone soft, reassuring, and consultative across Dutch and English surfaces.",
        ],
        visuals: [
          "Visual placeholder · Flowchart connecting rituals to adaptive product stacks",
          "Visual placeholder · Microcopy matrix with tonal sliders",
        ],
      },
      {
        title: "Pitch delivery with sensory storytelling",
        body: [
          "Packaged the concept into a sales deck that paired metrics (higher ritual completion, repeat orders) with emotive storytelling.",
          "Presented an interactive prototype with subtle parallax, allowing stakeholders to sense how rituals would evolve with each purchase.",
        ],
        visuals: [
          "Visual placeholder · Sales deck storyboard with conversion milestones",
          "Visual placeholder · Prototype screens highlighting ritual timelines",
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
          "Visual placeholder · Journey map of hybrid work touchpoints",
          "Visual placeholder · Benchmark dashboard for booking speed and confidence",
        ],
      },
      {
        title: "Experience layer rebuilt from the map out",
        body: [
          "Switched the information architecture to start with interactive maps so context, availability, and etiquette live on one canvas.",
          "Designed teammate locator microinteractions and predictive search chips that surface likely choices before users ask.",
        ],
        visuals: [
          "Visual placeholder · Interactive map frames with zoom states",
          "Visual placeholder · Microinteraction storyboard for teammate pulses",
        ],
      },
      {
        title: "Launch prep for a smoother rollout",
        body: [
          "Partnered with engineering to translate the vision into a performant React Native build with budgets for sub-second pinch-zoom.",
          "Co-wrote the ‘sneak peek’ campaign with product marketing, showcasing visuals that mirror the new navigation flow.",
        ],
        visuals: [
          "Visual placeholder · Performance budget overlay on prototype screens",
          "Visual placeholder · Launch teaser layout with motion cues",
        ],
      },
    ],
  },
  "gaiazoo-companion": {
    intro:
      "Structure ready for final GaiaZoo narrative. The sections below hold space for future field learnings while keeping visual artefacts aligned to the design thinking cadence.",
    phases: [
      {
        title: "Discover",
        body: [
          "Placeholder copy describing observation days inside the zoo and early family interviews.",
          "Replace with insights about empathy-building and conservation cues.",
        ],
        visuals: [
          "Visual placeholder · Field note collage awaiting photos",
          "Visual placeholder · Empathy map scaffolding",
        ],
      },
      {
        title: "Define",
        body: [
          "Placeholder copy outlining how problem statements are being shaped.",
          "Swap with final opportunity statements and success metrics.",
        ],
        visuals: [
          "Visual placeholder · Opportunity framing canvas",
          "Visual placeholder · KPI sketch cards",
        ],
      },
      {
        title: "Design",
        body: [
          "Placeholder copy referencing prototyping of adaptive maps, conservation stories, and reward loops.",
          "Replace once interaction flows and UI guidelines are approved.",
        ],
        visuals: [
          "Visual placeholder · Adaptive map frame stack",
          "Visual placeholder · Storytelling card explorations",
        ],
      },
      {
        title: "Deliver",
        body: [
          "Placeholder copy describing pilot setup, analytics instrumentation, and rollout plan.",
          "Update with launch metrics and conservation engagement signals.",
        ],
        visuals: [
          "Visual placeholder · Pilot dashboard layout",
          "Visual placeholder · Rollout timeline markers",
        ],
      },
    ],
  },
  "current-ev-charging-app": {
    intro:
      "Awaiting final copy for the Current EV charging story. This scaffold mirrors the design thinking rhythm so new narrative and artefacts can drop in immediately.",
    phases: [
      {
        title: "Discover",
        body: [
          "Text placeholder for field research with EV drivers and charge point operators.",
          "Swap with quotes, journey pains, and service blueprint notes once approved.",
        ],
        visuals: [
          "Visual placeholder · Journey map shell for route anxieties",
          "Visual placeholder · Service blueprint lanes ready for data",
        ],
      },
      {
        title: "Define",
        body: [
          "Text placeholder for How Might We statements and prioritised problems.",
          "Replace with chosen KPIs, personas, and guardrails provided by the team.",
        ],
        visuals: [
          "Visual placeholder · Prioritisation matrix canvas",
          "Visual placeholder · Persona spotlight layout",
        ],
      },
      {
        title: "Design",
        body: [
          "Text placeholder for prototyping loops around pricing clarity and station discovery.",
          "Update with final UI explorations, motion principles, and copy decks.",
        ],
        visuals: [
          "Visual placeholder · Flow storyboard for charge session booking",
          "Visual placeholder · Pricing transparency component set",
        ],
      },
      {
        title: "Deliver",
        body: [
          "Text placeholder for pilot preparation, analytics tagging, and loyalty program experiments.",
          "Replace with launch outcomes, retention curves, and roadmap notes.",
        ],
        visuals: [
          "Visual placeholder · Pilot dashboard wireframe",
          "Visual placeholder · Loyalty loop experiment tracker",
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
        "Initial research notes and discovery insights will be added here.",
        "Use this block to explain context, audience, and opportunity framing.",
      ],
      visuals: [
        "Visual placeholder · Discovery artefact",
        "Visual placeholder · Research highlight reel",
      ],
    },
    {
      title: "Design",
      body: [
        "Prototype notes, UI explorations, and motion studies are staged for future updates.",
        "Add learnings from testing and how the team iterated between rounds.",
      ],
      visuals: [
        "Visual placeholder · Prototype frames",
        "Visual placeholder · Interaction study",
      ],
    },
  ],
};

function VisualPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[4px] text-foreground/70 transition-all duration-500"
      style={{
        backgroundImage:
          "linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)), radial-gradient(circle at 12% 18%, rgba(142, 76, 255, 0.18), rgba(142, 76, 255, 0)), radial-gradient(circle at 82% 86%, rgba(204, 76, 255, 0.16), rgba(204, 76, 255, 0))",
        backgroundBlendMode: "screen, normal",
      }}
    >
      <div className="absolute inset-0 translate-y-[18%] scale-105 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_0%,_rgba(255,255,255,0)_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-80" />
      <span className="relative z-10 max-w-[78%] text-center text-sm leading-relaxed">
        {label}
      </span>
      <div className="absolute inset-x-6 bottom-6 h-px origin-left scale-x-50 bg-white/20 transition-transform duration-500 group-hover:scale-x-100" />
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
        <article className="mx-auto flex min-h-screen w-full flex-col">
          <div className="relative h-[68vh] min-h-[540px] w-full overflow-hidden">
            <Image
              src={project.image}
              alt={`${project.title} case hero`}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>

          <section className="w-full bg-black px-6 pb-24 pt-10 sm:px-10 sm:pt-14">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
              <div className="flex items-center justify-between gap-8 text-foreground">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-normal text-foreground/70 transition-colors hover:text-foreground"
                >
                  ← Back home
                </Link>
                <span className="text-[clamp(2.8rem,6vw,5rem)] font-light leading-[0.9] text-foreground">
                  {project.year}
                </span>
              </div>

              <div className="flex flex-col gap-6">
                <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-light leading-[0.9] text-foreground">
                  {project.title}
                </h1>
                {content.intro ? (
                  <p className="max-w-3xl text-lg leading-relaxed text-white/70">{content.intro}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-16">
                {content.phases.map((phase) => (
                  <section
                    key={`${project.slug}-${phase.title}`}
                    className="grid gap-12 md:grid-cols-[1.05fr_0.95fr]"
                  >
                    <div className="space-y-6">
                      <h2 className="text-[clamp(1.8rem,3.6vw,2.8rem)] font-light text-foreground">
                        {phase.title}
                      </h2>
                      <div className="space-y-4 text-white/65">
                        {phase.body.map((paragraph, index) => (
                          <p key={`${phase.title}-body-${index}`} className="leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-6">
                      {phase.visuals.map((label, index) => (
                        <VisualPlaceholder key={`${phase.title}-visual-${index}`} label={label} />
                      ))}
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

