import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const expertiseAreas = [

  {
    title: "Product Strategy",
    description: "20+ years of experience in product management and strategic market positioning.",
  },
  {
    title: "Startup Acceleration",
    description: "Mentoring and advising founders on rapid prototyping and go-to-market strategies.",
  },
  {
    title: "Innovation Leadership",
    description: "Driving technological advancement and cultural change in organizations.",
  },
];

export const ExpertiseCards = () => {
  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Areas of Expertise</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {expertiseAreas.map((area, index) => (
          <motion.div
            key={area.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">{area.title}</h3>
              <p className="text-muted-foreground">{area.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};