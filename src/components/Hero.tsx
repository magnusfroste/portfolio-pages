import { Brain, Rocket, LineChart, LucideIcon } from "lucide-react";
import { Navigation } from "./Navigation";
import { useHeroContent } from "@/hooks/useHeroContent";

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Rocket,
  LineChart,
};

export const Hero = () => {
  const { data: content, isLoading } = useHeroContent();

  if (isLoading) {
    return (
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center">
        <Navigation />
        <div className="container mx-auto text-center">
          <div className="h-12 w-48 bg-gray-200 animate-pulse rounded mx-auto mb-12" />
          <div className="h-8 w-96 bg-gray-200 animate-pulse rounded mx-auto mb-12" />
          <div className="flex justify-center gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!content) return null;

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center">
      <Navigation />
      
      <div className="container mx-auto text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-rose-600 bg-clip-text text-transparent mb-12">
          {content.title}
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          {content.subtitle}
        </p>
        
        <div className="flex justify-center gap-12 text-gray-700">
          {content.features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div key={index} className="flex items-center gap-2">
                <Icon className="h-6 w-6 text-blue-600" />
                <span>{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};