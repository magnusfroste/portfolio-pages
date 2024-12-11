import { Hero } from "@/components/Hero";
import { ExpertiseCards } from "@/components/ExpertiseCards";
import { PortfolioSection } from "@/components/PortfolioSection";
import { AboutMe } from "@/components/AboutMe";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <AboutMe />
      <ExpertiseCards />
      <PortfolioSection />
      <Contact />
    </main>
  );
};

export default Index;