import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PortfolioCard = {
  id: number;
  header: string;
  description: string;
  link: string;
  image_url: string | null;
  sort_order: number;
};

const Cards = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_cards')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setPortfolioItems(data || []);
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
        toast({
          title: "Error",
          description: "Failed to load portfolio items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [toast]);

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('portfolio_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPortfolioItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Portfolio Cards Management</h1>
          </div>
          <Button onClick={() => navigate("/dashboard/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>
        
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
                    <div 
                      className="relative w-full rounded-md overflow-hidden" 
                      style={{ height: '300px' }}
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.header}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      )}
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
                        onClick={() => navigate(`/dashboard/edit/${item.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
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
    </section>
  );
};

export default Cards;