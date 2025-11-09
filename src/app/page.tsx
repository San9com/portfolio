import { Header } from "@/components/header";
import { HeroSection } from "@/components/sections/hero";
import { WorkSection } from "@/components/sections/work";
import { ExperienceSection } from "@/components/sections/experience";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="relative">
        <HeroSection />
        <WorkSection />
        <ExperienceSection />
      </main>
      <Footer />
    </div>
  );
}
