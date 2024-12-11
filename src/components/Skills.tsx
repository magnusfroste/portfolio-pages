import { motion } from "framer-motion";
import { Code2, Palette, Server } from "lucide-react";

const skills = [
  {
    category: "Frontend",
    icon: <Code2 className="w-6 h-6" />,
    items: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
  },
  {
    category: "Backend",
    icon: <Server className="w-6 h-6" />,
    items: ["Node.js", "Python", "PostgreSQL", "AWS"],
  },
  {
    category: "Design",
    icon: <Palette className="w-6 h-6" />,
    items: ["Figma", "Adobe XD", "UI/UX", "Responsive Design"],
  },
];

export const Skills = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Skills & Technologies
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 bg-white rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                {skill.icon}
                <h3 className="text-xl font-semibold">{skill.category}</h3>
              </div>
              <ul className="space-y-2">
                {skill.items.map((item) => (
                  <li key={item} className="text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};