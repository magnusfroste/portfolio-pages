import { Brain, Rocket, LineChart } from "lucide-react";
import { Navigation } from "./Navigation";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center">
      <Navigation />
      
      <div className="container mx-auto text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-rose-600 bg-clip-text text-transparent mb-12">
          Magnus Froste
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Innovation Strategist • AI Integration Expert • Product Visionary
        </p>
        
        <div className="flex justify-center gap-12 text-gray-700">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>AI Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-orange-500" />
            <span>Innovation Strategy</span>
          </div>
          <div className="flex items-center gap-2">
            <LineChart className="h-6 w-6 text-blue-500" />
            <span>Product Growth</span>
          </div>
        </div>
      </div>
    </section>
  );
};