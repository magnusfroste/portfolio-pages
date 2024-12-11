import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const portfolioItems = [

  {
    title: "LEtGO, for LEGO entusiasts!",
    description: "Developed an innovative cure your LEGO craving, buy / sell or trade with neighbours! market - “just take a simple photo and AI is adding descriptions. based on image recognition,
    image: letgo.png,
    demoLink: "https://friendly-classifieds-hub.vercel.app",
  },

  {
    title: "Chat with your visitor statistics!",
    description: "Created a comprehensive customer success framework that uses AI to help store owners to better understand their visitor data. This proactive approach resulted in an increased interest for the core product. Upload and visualize your visitor data, get advices how to increase sales!”,
    image: “visitors.png,
    demoLink: "https://llm-retail.anavid.io",
  },

  {
    title: "Aircount",
    description: "Streamlined accounting for solopreneurs, get in driver seat with double-entry accounting,
    image: aircount.png,
    demoLink: "https://aircount.froste.eu“,
  }


  {
    title: "School AI",
    description: "Innovative concepts for future learning, exploring various concepts that combine children's interests and curiosity to create engaging learning methods.",
    image: skola.png,
    demoLink: "https://skola.froste.eu“,
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