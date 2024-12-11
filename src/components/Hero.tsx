import { Brain, Rocket, ChartBar } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Magnus Froste
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Innovation Strategist • AI Integration Expert • Product Visionary
        </p>
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span>AI Integration</span>
          </div>
          <div className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-accent" />
            <span>Innovation Strategy</span>
          </div>
          <div className="flex items-center gap-2">
            <ChartBar className="w-6 h-6 text-primary" />
            <span>Product Growth</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};