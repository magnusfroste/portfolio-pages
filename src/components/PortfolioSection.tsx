import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const portfolioItems = [
  {
    title: "AI-Powered Market Analysis Platform",
    description: "Developed an innovative market analysis platform that leverages machine learning to identify emerging market trends and opportunities. The system processes vast amounts of market data to provide actionable insights for strategic decision-making.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    demoLink: "#",
  },
  {
    title: "Intelligent Customer Success Framework",
    description: "Created a comprehensive customer success framework that uses AI to predict customer needs and potential challenges. This proactive approach resulted in a 40% increase in customer satisfaction and 25% reduction in churn rate.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    demoLink: "#",
  },
  {
    title: "Startup Innovation Accelerator",
    description: "Designed and implemented an AI-driven startup acceleration program that helps founders validate their ideas and go-to-market strategies faster. The platform combines market intelligence with predictive analytics.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    demoLink: "#",
  }
];

export const PortfolioSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Recent AI Initiatives
        </h2>
        
        <div className="space-y-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative h-[300px] md:h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <CardHeader className="p-0">
                        <CardTitle className="text-2xl mb-4">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="text-muted-foreground mb-6">{item.description}</p>
                      </CardContent>
                    </div>
                    <Button
                      variant="outline"
                      className="w-fit"
                      asChild
                    >
                      <a href={item.demoLink} target="_blank" rel="noopener noreferrer">
                        View Demo <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};