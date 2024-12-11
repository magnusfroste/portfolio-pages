import { motion } from "framer-motion";
import { Brain, Rocket, Command } from "lucide-react";

export const AboutMe = () => {
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          About Me
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg leading-relaxed">
              As a seasoned technology leader and innovator, I've dedicated my career to helping organizations navigate the rapidly evolving tech landscape. My passion lies in identifying transformative opportunities at the intersection of business and technology, particularly in the realm of artificial intelligence.
            </p>
            <p className="text-lg leading-relaxed">
              With extensive experience in rapid application prototyping and product development, I excel at turning complex ideas into tangible solutions. My approach combines strategic thinking with hands-on technical expertise, ensuring that innovation translates directly into business value.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Integration</h3>
                <p className="text-muted-foreground">
                  Pioneering AI solutions that transform business operations and create competitive advantages.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Rocket className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Product Strategy</h3>
                <p className="text-muted-foreground">
                  20+ years of experience in product management and successful market launches across different sectors.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Command className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Technology Leadership</h3>
                <p className="text-muted-foreground">
                  Proven track record as CTO, leading teams and implementing cutting-edge technology solutions.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};