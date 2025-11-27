import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { BackHomeButton } from "@/components/back-home-button";
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
      "FiDB came from a different time. It had loyal Formula One followers, a dedicated user base, and decent organic growth. Yet visually and structurally, it felt rooted in the aesthetic language of 2018. The app had potential but needed a refresh that respected its heritage while aligning it with modern expectations.",
    phases: [
      {
        title: "An app stuck in an older world",
        body: [
          "FiDB came from a different time. It had loyal Formula One followers, a dedicated user base, and decent organic growth. Yet visually and structurally, it felt rooted in the aesthetic language of 2018. The app had potential but needed a refresh that respected its heritage while aligning it with modern expectations.",
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
          "We analyzed the entire architecture, refined flows, and introduced visual patterns that felt more intentional. The goal was not to reinvent the experience but to remove unnecessary complexity, making it easier for users to find value. By polishing old elements and introducing new ones, the app gained a sense of clarity and confidence that it had previously lacked.",
        ],
        visuals: [],
      },
      {
        title: "Design that supports conversions",
        body: [
          "Improving conversion required more than surface changes. We needed to build trust through transparency, predictability, and visual integrity. Users subscribe when they feel the product understands them, and the redesign emphasized this feeling. We reorganized information so that the benefits became clearer, and the trial journey felt less abrupt.",
        ],
        visuals: [],
      },
      {
        title: "A quiet improvement",
        body: [
          "The changes did not scream, yet they brought the app forward. FiDB became more elegant, cleaner, and easier to understand. In many ways, the redesign gave the product a new voice without changing its heart.",
        ],
        visuals: [],
      },
    ],
  },
  "elvou-app-concept": {
    intro:
      "Elvou operates in a world of health, wellness, and lifestyle products. Their physical identity was strong, their tone felt premium, but the digital side lacked a central place where customers could experience the brand. This absence became the starting point for Elevate Club, a concept meant to extend their presence into a more interactive, emotional space.",
    phases: [
      {
        title: "A brand with potential waiting to be unlocked",
        body: [
          "Elvou operates in a world of health, wellness, and lifestyle products. Their physical identity was strong, their tone felt premium, but the digital side lacked a central place where customers could experience the brand. This absence became the starting point for Elevate Club, a concept meant to extend their presence into a more interactive, emotional space.",
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
          "The vision behind the app was simple. It should not feel like a store, or a dashboard, or a tool. It should feel like a companion that supports a healthier routine. The app combines tracking, meditations, mindful practices, and access to the brand's products in a way that feels integrated. Apple Health connectivity adds a layer of intelligence, connecting the user's body data with the broader experience of the brand.",
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
          "The visual direction aims to reflect the softness and clarity associated with wellness. We avoided heavy ornamentation and leaned instead into gentle motion, balanced spacing, and a mood that invites calm. The identity stays consistent across features, allowing users to move from tracking to meditation to browsing without feeling shifts in personality.",
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
          "This proposal is designed to elevate the Elvou brand and expand the value it offers customers. It provides a quiet digital home for a wellness lifestyle rather than a simple catalog of products.",
        ],
        visuals: [],
      },
    ],
  },
  "iotspot-case": {
    intro:
      "When I first stepped into the iotSpot ecosystem, I felt something almost paradoxical. The app was full of potential, full of features, full of ideas, but the experience itself felt busy and slightly overwhelmed. People were given maps and lists, sometimes even different entry points for simple tasks, and the product expected them to understand how everything worked together.",
    phases: [
      {
        title: "A quiet beginning",
        body: [
          "When I first stepped into the iotSpot ecosystem, I felt something almost paradoxical. The app was full of potential, full of features, full of ideas, but the experience itself felt busy and slightly overwhelmed. People were given maps and lists, sometimes even different entry points for simple tasks, and the product expected them to understand how everything worked together. I could see users constantly shifting their attention, opening one view, closing another, trying to connect meaning that the interface never fully communicated. It was clear that the app needed not more features but more calmness, more guidance, more invisible structure. I wanted to create a product that greeted people with clarity the moment they opened it, something that felt helpful before they even touched the screen.",
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
          "We began a long process of refinement, and the word long is not an exaggeration. We made more than fifteen iterations, each one built on insights from real user tests. Every round gave us another small clue, something we could polish, something we could adjust. I treated the work almost like sculpting, slowly removing unnecessary edges, discovering what the product was trying to become. Some days the changes were tiny, barely noticeable to anyone else, but they mattered, because I knew the product had to feel effortless, not impressive. The deeper we went, the more I realized that true improvement often happens in the quiet parts of the process, in the details you only notice when you care enough to look twice.",
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
          "The breakthrough came unexpectedly, during one of the many moments when we tried to map user behavior. I realized that people were not confused by the content itself, they were confused by the transitions, the movement between the map and the hierarchical list of spaces. This led to the idea of a floating navigation element, something always present, always ready, but never intrusive. When we placed it inside the interface, something clicked. It allowed people to move between contexts without being forced to \"reset\" their mental model. We added filters inside it, letting users control their view with a single gesture. It felt like a small detail, but it reshaped the entire experience, giving the product a sense of confidence that had been missing before.",
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
          "By the end, the app transformed into something that felt more intentional, more thoughtful. The design became lighter, the flows became smoother, and the overall experience gained a sense of quiet maturity. IotSpot became a product that respects the user's cognitive load, acknowledging that people do not want to fight with their workspace tools. They want something that behaves like a reliable companion, not a puzzle. This project grew into a reflection of how I design, structured at the core, patient in process, and always striving for clarity that feels almost invisible.",
        ],
        visuals: [],
      },
    ],
  },
  "gaiazoo-companion": {
    intro:
      "GaiaZoo invited us to create a concept for a new app, and because I had worked with their previous version, I already had a connection to the environment. The zoo has an emotional presence that goes beyond attractions. Families create memories there, children experience animals for the first time, and the day becomes a story that starts long before they enter the gates.",
    phases: [
      {
        title: "Breathing new life into a zoo",
        body: [
          "GaiaZoo invited us to create a concept for a new app, and because I had worked with their previous version, I already had a connection to the environment. The zoo has an emotional presence that goes beyond attractions. Families create memories there, children experience animals for the first time, and the day becomes a story that starts long before they enter the gates. The old app captured some of this but struggled with clarity. We felt a responsibility to shape something that did justice to the atmosphere of the place.",
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
          "We decided early that research should not happen through screens. We visited the zoo in Kerkrade, walked the full route, watched how families moved, where they paused, what confused them, and what delighted them. We studied visitor reviews, looked for patterns, and discovered that people wanted better structure, clearer maps, easier planning, and a more intuitive digital companion. Observing behavior in real space allowed us to understand not just what users said but what they needed.",
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
          "The previous app had features that people genuinely loved, especially the children's games and the interactive map. We decided to protect these elements, polishing them without removing their charm. We redesigned navigation, modernized the interface, improved information architecture, and added thoughtful touches like Apple Wallet passes and simplified day planning tools. It felt like giving the app a new personality without erasing its history.",
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
          "Although we did not win the tender, we placed second, which was meaningful considering the scale of the agencies we competed with. Our concept was praised for its structure, empathy, and attention to human behavior. The project reaffirmed my belief that a thoughtful process can create value even when it does not lead to a contract.",
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
      "Current EV became a rare opportunity for me to guide a product through an entire structured journey, from the earliest discovery work to the final visual details. I followed a complete Double Diamond, embracing every phase with discipline and clarity.",
    phases: [
      {
        title: "The project from the first step to the last",
        body: [
          "Current EV became a rare opportunity for me to guide a product through an entire structured journey, from the earliest discovery work to the final visual details. I followed a complete Double Diamond, embracing every phase with discipline and clarity. We conducted research sessions, mapped user journeys, created personas, analyzed energy pricing behaviors, and facilitated workshops with real drivers, all to capture the complexity of how people negotiate charging in their daily routines. The structure gave the project a solid backbone, something that allowed creativity and engineering to work together instead of competing for space.",
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
          "The goal was not simply to control electricity. The app needed to understand life. We built an intelligent system that monitors electricity prices, aligns with the user's Outlook schedule, and balances convenience with cost. The app learns from the rhythm of a person's days, recognizing when they need their car ready early, when they drive late, and when they unexpectedly stay home. Instead of forcing people into patterns, it adapts to them. This made the product feel less like a utility and more like a quiet assistant, something that works in the background without demanding attention.",
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
          "Throughout the project, I facilitated workshops that brought together drivers, managers, stakeholders, developers, and energy experts. Each session became a way to refine assumptions, surface blind spots, and build alignment. We tested concepts early, explored misunderstandings, validated ideas, and allowed the product to evolve naturally. Every workshop brought us a step closer to an experience that felt grounded in reality rather than abstraction.",
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
          "The final design is clean and calm, intentionally restrained, focused on clarity instead of decoration. We wanted users to trust the app, and trust comes from predictability and honesty. Every screen follows a logic that feels natural, every flow leads the user gently to the next step. Current EV became a project where structure and emotion work together, something that reflects the discipline of the process as much as the empathy behind it.",
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
      "Mkb Brandstof had reached a moment where they no longer trusted their existing development partner, and they invited multiple agencies to propose a fresh approach. The context was competitive and serious, with some of the largest Dutch digital agencies presenting their solutions.",
    phases: [
      {
        title: "A client in search of clarity",
        body: [
          "Mkb Brandstof had reached a moment where they no longer trusted their existing development partner, and they invited multiple agencies to propose a fresh approach. The context was competitive and serious, with some of the largest Dutch digital agencies presenting their solutions. For us, this was an opportunity to show what thoughtful design can do, even with a small team.",
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
          "We looked at user behavior, reviews, and support tickets, and discovered that the biggest frustration came from uncertainty. People often did not remember if a parking session was still active, which led to unnecessary payments or unexpected fines. It was a small problem in appearance, but for users it became a regular source of stress. Solving it required clarity more than innovation.",
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
          "I designed a concept using Apple Live Activities, which allowed users to see their parking status directly on the lock screen. It gave them an immediate overview, without having to open the app or guess. The timer, location, and state all lived in one place, accessible the moment they looked at their phone. It made the experience feel more predictable, more human, and more considerate of daily routines.",
        ],
        visuals: [],
      },
      {
        title: "A near win against large teams",
        body: [
          "We finished second, largely because larger agencies could offer bigger development resources for long term support. Still, our concept was praised for its clarity and practicality. The project demonstrated that thoughtful design can stand strong even in the middle of heavy competition.",
        ],
        visuals: [],
      },
    ],
  },
  "stmpd-records": {
    intro:
      "The invitation to work on the identity of Stmpd Records felt extraordinary. It is not every day that a student team is trusted with a project connected to one of the most respected creative studios in Amsterdam, a studio rooted in the work of Martin Garrix and the artists who surround him.",
    phases: [
      {
        title: "A rare invitation",
        body: [
          "The invitation to work on the identity of Stmpd Records felt extraordinary. It is not every day that a student team is trusted with a project connected to one of the most respected creative studios in Amsterdam, a studio rooted in the work of Martin Garrix and the artists who surround him. When we first stepped into this world, we felt the gravity of the place. It was not simply a recording space, it was a cultural environment where sound, image, personality, and atmosphere lived together. Being chosen to reimagine how such a place presents itself demanded sensitivity, curiosity, and a willingness to look deeper than aesthetics.",
          "Visiting the studio left me deeply impressed by its exclusivity and history. Walking through the same space where some of the most iconic tracks were created felt surreal. I learned that Lady Gaga recorded \"Bad Romance\" there some time ago, which added another layer to understanding the weight and significance of this place. The studio carries an energy that goes beyond its physical walls—it is a space where creative legends have worked, where ideas have transformed into cultural moments.",
        ],
        visuals: [
          {
            image: "/Image2667.webp",
            alt: "The STMPD Records studio space showing its exclusive creative environment.",
          },
          {
            image: "/STMPD 1.png",
            alt: "The STMPD Records studio space and creative environment.",
          },
        ],
      },
      {
        title: "Searching for the true character",
        body: [
          "Early on, we understood that the challenge was not to make something louder or more dramatic. Loudness, after all, is simple. What Stmpd needed was something more honest, something that captured the studio's creative rhythm rather than its surface-level glamour. We spent time studying how artists behave inside the space, how collaborators communicate, how ideas move from the first spark to the final export. We discovered that the studio was less about the equipment and more about the relationships, the trust, the environment where people feel safe to experiment. This became the emotional foundation we wanted the identity to express, a quiet confidence rather than a loud brand voice.",
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
          "We explored different visual directions, each built on conversations, sketches, mood explorations, and emotional mappings. We played with the contrast between intimacy and scale, between raw creative energy and polished final outputs. We studied the materials inside the studio, the light, the texture of the spaces, even the rhythm of the workflow. Slowly, a concept formed that treated the studio as a story rather than a logo. It felt more like a narrative, something that unfolds, something that invites the audience inside instead of pushing them away with intensity.",
        ],
        visuals: [],
      },
      {
        title: "Still in motion",
        body: [
          "The project is still developing, and every week adds new depth. There is something rewarding about work that breathes and grows rather than ending abruptly. Stmpd Records has become a reminder of the type of design I love, design that requires listening before creating, design that treats identity as something alive. It is a project that keeps teaching me to stay curious.",
        ],
        visuals: [],
      },
    ],
  },
  "apperium-website-redesign": {
    intro:
      "This redesign meant more than a project to me. It was for Apperium, the company where I started as an intern and eventually worked part time. I had lived with their Squarespace site long enough to see its limitations, from the restricted layouts to the difficulty of maintaining consistency.",
    phases: [
      {
        title: "A return to a familiar place",
        body: [
          "This redesign meant more than a project to me. It was for Apperium, the company where I started as an intern and eventually worked part time. I had lived with their Squarespace site long enough to see its limitations, from the restricted layouts to the difficulty of maintaining consistency. The brand had evolved, but the website had not. It needed a new foundation.",
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
          "I developed a new style guide that captured a modern, forward looking identity. The visuals leaned into the futuristic, with touches of Liquid Glass and confident typography. The goal was to create a digital presence that felt memorable rather than generic. Many app agencies blend together visually, and I wanted Apperium to stand apart with a personality that felt intentional and bold.",
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
          "I designed everything in Figma, reviewing it internally with the team, collecting feedback, and making thoughtful adjustments. Each iteration brought the site closer to a balance between clarity and personality. The process felt structured, almost methodical, yet never rigid. It allowed creativity to find its place inside a strong framework.",
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
          "After the design matured, I rebuilt the entire site inside Framer, giving it flexibility and motion that traditional builders often lack. The final product reflects the rhythm of the brand, and it continues to grow with new cases and stories. It now lives online as a confident expression of what Apperium stands for.",
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

  // Track used images to prevent duplicates across all phases
  const usedImages = new Set<string>([project.image]); // Add cover image to used set

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
              <div className="sticky top-24 z-20 flex items-center justify-between gap-8 text-foreground sm:top-28">
                <BackHomeButton />
              </div>

              {/* Hero Section - Matches reference style */}
              <div className="flex flex-col gap-8 text-foreground lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                <div className="flex flex-col gap-6 lg:flex-1">
                  <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] tracking-tight">
                    {project.slug === "stmpd-records" ? "STMPD Records (Martin Garrix)" : project.title}
                  </h1>
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
                        .filter((visual) => {
                          // Filter out cover image and already used images
                          if (visual.image === project.image) return false;
                          if (usedImages.has(visual.image)) return false;
                          usedImages.add(visual.image); // Mark as used
                          return true;
                        })
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

