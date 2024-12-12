import { Hero } from "@/components/Hero";
import { ExpertiseCards } from "@/components/ExpertiseCards";
import { PortfolioSection } from "@/components/PortfolioSection";
import { AboutMe } from "@/components/AboutMe";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <AboutMe />
      <ExpertiseCards />
      <PortfolioSection />
      <Contact />
    </main>
  );
};

export default Index;