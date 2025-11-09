import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

type WorkPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = params;
  const project = projects.find((item) => item.slug === slug);

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

export default function WorkCasePage({ params }: WorkPageProps) {
  const { slug } = params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="px-6 pb-24 pt-28 sm:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <div className="flex items-center justify-between text-sm text-muted">
          <Link href="/" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground">
            ← Back home
          </Link>
          <span>{project.year}</span>
        </div>

        <div className="space-y-6">
          <h1 className="font-serif text-4xl text-foreground sm:text-5xl">{project.title}</h1>
          <p className="text-base leading-relaxed text-muted sm:text-lg">{project.description}</p>
        </div>

        <div className="overflow-hidden border border-white/10 p-4">
          <div className="relative aspect-[3/2] w-full overflow-hidden border border-white/15">
            <Image
              src={project.image}
              alt={`${project.title} mockup`}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="space-y-4 text-sm text-muted">
          <p>
            This case study page is a placeholder scaffold. Replace the narrative and imagery inside
            <code className="mx-1 border border-white/20 bg-black/30 px-1 py-0.5 text-[0.75rem] text-foreground">src/app/work/[slug]/page.tsx</code>
            once the full story is ready.
          </p>
          <p>
            All hero data for the listing is sourced from <code className="mx-1 border border-white/20 bg-black/30 px-1 py-0.5 text-[0.75rem] text-foreground">src/data/projects.ts</code>
            so you can adjust copy, colors, and assets without touching components.
          </p>
        </div>
      </div>
    </div>
  );
}

