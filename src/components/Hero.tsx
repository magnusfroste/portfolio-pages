import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Hi, I'm <span className="hero-gradient">Your Name</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          A passionate developer crafting beautiful digital experiences
        </p>
        <ArrowDown className="w-6 h-6 mx-auto animate-bounce text-gray-400" />
      </motion.div>
    </section>
  );
};