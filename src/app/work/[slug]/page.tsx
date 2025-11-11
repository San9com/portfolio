import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { projects } from "@/data/projects";

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

          <section className="w-full bg-black px-6 pb-24 pt-16 sm:px-10 sm:pt-20">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
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

              <div className="flex items-end justify-between gap-10">
                <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-light leading-[0.9] text-foreground">
                  {project.title}
                </h1>
              </div>

              <div className="grid gap-14 text-sm leading-relaxed text-white/65 md:grid-cols-2 md:gap-20 md:text-base">
                <div className="space-y-6">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus, sapien ut
                    tincidunt gravida, arcu risus luctus odio, vel accumsan lorem nulla vel nibh. Sed
                    posuere, mauris vitae faucibus posuere, nibh purus commodo nisl, vitae placerat
                    odio sapien a eros. Integer consequat suscipit magna, eget pretium mi tristique
                    in.
                  </p>
                  <p>
                    Suspendisse potenti. Donec vitae volutpat urna. Proin viverra, massa ut laoreet
                    tristique, nisi sem pharetra felis, vitae vestibulum turpis magna eget nibh. In
                    finibus sollicitudin tortor, vitae tempor purus viverra sit amet.
                  </p>
                </div>
                <div className="space-y-6">
                  <p>
                    Duis vehicula, augue eget tristique pretium, nibh mauris interdum erat, sed
                    facilisis lorem lacus ac erat. Integer at dictum dui. Pellentesque habitant morbi
                    tristique senectus et netus et malesuada fames ac turpis egestas.
                  </p>
                  <p>
                    Vivamus euismod libero vel vulputate posuere. Praesent nec leo id diam eleifend
                    sollicitudin sed quis lectus. Aenean semper sapien sed nisl auctor, vitae aliquam
                    mi pellentesque.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

