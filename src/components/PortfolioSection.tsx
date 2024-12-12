import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { ProjectDialog } from "./ProjectDialog";

type PortfolioCard = {
  id: number;
  header: string;
  description: string;
  link: string;
  image_url: string;
  sort_order: number;
};

export const PortfolioSection = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioCard[]>([]);
  const [selectedProject, setSelectedProject] = useState<null | PortfolioCard>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_cards')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching portfolio items:', error);
          return;
        }

        setPortfolioItems(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  const handlePortfolioClick = async (project: PortfolioCard) => {
    try {
      await supabase
        .from('portfolio_clicks')
        .insert([{ project_title: project.header }]);
      
      setSelectedProject(project);
      console.log('Click tracked successfully');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Loading...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Recent AI Initiatives and Proof of Concepts
        </h2>
        
        <div className="space-y-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="grid md:grid-cols-2 gap-10 items-start">
                  <div className="p-6">
                    <div className="relative w-full rounded-md overflow-hidden" style={{ height: '300px' }}>
                      <img
                        src={item.image_url}
                        alt={item.header}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <div className="p-12 flex flex-col justify-between">
                    <div>
                      <CardHeader className="p-0">
                        <CardTitle className="text-2xl mb-6">{item.header}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="default"
                        className="w-fit"
                        onClick={() => handlePortfolioClick(item)}
                      >
                        View in App
                      </Button>
                      <Button
                        variant="outline"
                        className="w-fit"
                        asChild
                      >
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          Open in New Tab <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectDialog
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </section>
  );
};