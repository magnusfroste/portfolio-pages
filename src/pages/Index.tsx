import { Hero } from "@/components/Hero";
import { ExpertiseCards } from "@/components/ExpertiseCards";
import { PortfolioSection } from "@/components/PortfolioSection";
import { AboutMe } from "@/components/AboutMe";
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Magnus Froste - Innovation Strategist & AI Integration Expert</title>
        <meta name="description" content="Magnus Froste - Innovation Strategist, AI Integration Expert, and Product Visionary. Specializing in AI integration, innovation strategy, and product growth." />
      </Helmet>
      <main className="min-h-screen" role="main">
        <Navigation />
        <Hero />
        <AboutMe />
        <ExpertiseCards />
        <PortfolioSection />
        <Contact />
      </main>
    </>
  );
};

export default Index;