import type { Metadata } from "next";
import Link from "next/link";
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
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Pellentesque habitant morbi tristique senectus et netus et malesuada fames.",
        ],
      },
      {
        title: "Define — conversion hypotheses that feel helpful",
        body: [
          "Established a value ladder that opens premium deltas inside free cards, so each upgrade prompt emerges inside the narrative of a race weekend.",
          "Reordered navigation around ‘Weekend story, Driver duel, Season arc’ so fans feel guided rather than siloed into features.",
        ],
        visuals: [
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        ],
      },
      {
        title: "Design — a tile system built for upsell moments",
        body: [
          "Crafted a modular stat tile with live deltas, heroing what the subscription unlocks through subtle glass layers and motion affordances.",
          "Reimagined onboarding into a three-step warm-up with social proof, driver spotlights, and calendar hooks leading toward trial activation.",
        ],
        visuals: [
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        ],
      },
      {
        title: "Prepare — experiments before the next lights out",
        body: [
          "Outlined multi-variant experiments for trial wording, referral codes, and weekend-specific upgrade banners.",
          "Partnered with marketing on a race-week content cadence so organic spikes in traffic route directly into the new upgrade loops.",
        ],
        visuals: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidunt.",
          "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio bibendum, ac sollicitudin erat placerat.",
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
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Aliquam erat volutpat. Donec a dui et dui fringilla consectetur id nec massa.",
        ],
      },
      {
        title: "Narrative architecture for guided commerce",
        body: [
          "Mapped flows where every product recommendation is introduced as a step in a breathing or movement ritual, reducing the feeling of being sold to.",
          "Built a bilingual microcopy matrix to keep the tone soft, reassuring, and consultative across Dutch and English surfaces.",
        ],
        visuals: [
          "Suspendisse potenti. Praesent lacinia, arcu non egestas tristique, nibh erat facilisis urna, at dignissim libero ipsum ut justo.",
          "Integer sit amet lacus ac sapien vehicula luctus quis vel justo.",
        ],
      },
      {
        title: "Pitch delivery with sensory storytelling",
        body: [
          "Packaged the concept into a sales deck that paired metrics (higher ritual completion, repeat orders) with emotive storytelling.",
          "Presented an interactive prototype with subtle parallax, allowing stakeholders to sense how rituals would evolve with each purchase.",
        ],
        visuals: [
          "Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate.",
          "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
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
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Aenean commodo ligula eget dolor. Aenean massa.",
        ],
      },
      {
        title: "Experience layer rebuilt from the map out",
        body: [
          "Switched the information architecture to start with interactive maps so context, availability, and etiquette live on one canvas.",
          "Designed teammate locator microinteractions and predictive search chips that surface likely choices before users ask.",
        ],
        visuals: [
          "Nullam dictum felis eu pede mollis pretium. Integer tincidunt.",
          "Cras dapibus. Vivamus elementum semper nisi.",
        ],
      },
      {
        title: "Launch prep for a smoother rollout",
        body: [
          "Partnered with engineering to translate the vision into a performant React Native build with budgets for sub-second pinch-zoom.",
          "Co-wrote the ‘sneak peek’ campaign with product marketing, showcasing visuals that mirror the new navigation flow.",
        ],
        visuals: [
          "Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.",
          "Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.",
        ],
      },
    ],
  },
  "gaiazoo-companion": {
    intro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus convallis, erat vel efficitur auctor, purus tellus ultrices odio, in cursus risus nibh sed erat.",
    phases: [
      {
        title: "Discover",
        body: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis, turpis id facilisis lobortis, nisl nibh ornare nulla, vel laoreet odio lorem nec neque.",
          "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
        ],
        visuals: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Quisque vehicula lectus non justo fermentum, vitae fringilla nisl aliquet.",
        ],
      },
      {
        title: "Define",
        body: [
          "Integer fringilla, augue eget tincidunt auctor, urna erat varius nisl, sed sollicitudin erat sem at arcu.",
          "Curabitur aliquet, sapien a lacinia mattis, tortor arcu ultricies quam, ut scelerisque erat orci eget risus.",
        ],
        visuals: [
          "Sed at sem vitae sapien blandit posuere.",
          "Donec ullamcorper nulla non metus auctor fringilla.",
        ],
      },
      {
        title: "Design",
        body: [
          "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.",
          "Maecenas faucibus mollis interdum. Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
        ],
        visuals: [
          "Nullam id dolor id nibh ultricies vehicula ut id elit.",
          "Etiam porta sem malesuada magna mollis euismod.",
        ],
      },
      {
        title: "Deliver",
        body: [
          "Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum.",
          "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
        ],
        visuals: [
          "Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
          "Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
        ],
      },
    ],
  },
  "current-ev-charging-app": {
    intro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat quam vel augue accumsan, vitae tempus lacus vulputate.",
    phases: [
      {
        title: "Discover",
        body: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sit amet turpis at odio egestas commodo.",
          "Mauris sed tortor sed neque vehicula dictum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames.",
        ],
        visuals: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          "Quisque sodales arcu vel dui vestibulum, non finibus nulla mollis.",
        ],
      },
      {
        title: "Define",
        body: [
          "Suspendisse euismod, urna id vestibulum cursus, nulla turpis faucibus est, vitae convallis magna lacus vel erat.",
          "Etiam porta, massa vel dapibus aliquet, ante metus efficitur justo, id finibus lorem sapien vitae purus.",
        ],
        visuals: [
          "Sed posuere consectetur est at lobortis.",
          "Cras justo odio, dapibus ac facilisis in, egestas eget quam.",
        ],
      },
      {
        title: "Design",
        body: [
          "Donec id elit non mi porta gravida at eget metus.",
          "Vestibulum id ligula porta felis euismod semper.",
        ],
        visuals: [
          "Maecenas sed diam eget risus varius blandit sit amet non magna.",
          "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
        ],
      },
      {
        title: "Deliver",
        body: [
          "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
          "Curabitur blandit tempus porttitor. Sed posuere consectetur est at lobortis.",
        ],
        visuals: [
          "Aenean lacinia bibendum nulla sed consectetur.",
          "Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
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
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
      ],
      visuals: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      ],
    },
    {
      title: "Design",
      body: [
        "Proin nec libero gravida, fermentum ligula a, aliquet ipsum.",
        "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
      ],
      visuals: [
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      ],
    },
  ],
};

function VisualPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
      <div className="relative flex min-h-[80svh] w-full items-center justify-center bg-[#141414]">
        <p className="max-w-[72ch] px-8 text-center text-base leading-relaxed text-white/35">
          {label}
        </p>
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
        <article className="mx-auto flex min-h-screen w-full flex-col">
          <CaseVisualShowcase image={project.image} alt={`${project.title} hero visual`} />
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

              <div className="flex flex-col gap-20">
                {content.phases.map((phase) => (
                  <section key={`${project.slug}-${phase.title}`} className="flex flex-col gap-12">
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
                    {phase.visuals.map((label, index) => (
                      <VisualPlaceholder key={`${phase.title}-visual-${index}`} label={label} />
                    ))}
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

