import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";

export const Contact = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Get In Touch</h2>
        <p className="text-xl text-gray-600 mb-12">
          I'm always open to new opportunities and interesting projects.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center gap-8"
        >
          <a
            href="mailto:your.email@example.com"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Mail className="w-6 h-6" />
            <span>Email</span>
          </a>
          <a
            href="https://github.com/yourusername"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Github className="w-6 h-6" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Linkedin className="w-6 h-6" />
            <span>LinkedIn</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};