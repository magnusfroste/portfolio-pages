import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { ProjectDialog } from "./ProjectDialog";
import { PortfolioCard } from "./PortfolioCard";
import { motion } from "framer-motion";

export const PortfolioSection = () => {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  const handlePortfolioClick = async (project: any) => {
    if (editingId === project.id) return;
    
    try {
      await supabase
        .from('portfolio_clicks')
        .insert([{ 
          project_title: project.header,
          user_id: session?.user?.id 
        }]);
      
      setSelectedProject(project);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const saveChanges = async (item: any, formData: any) => {
    try {
      const { error } = await supabase
        .from('portfolio_cards')
        .update({
          header: formData.header,
          description: formData.description,
          link: formData.link,
          image_url: formData.image_url,
          user_id: session?.user?.id
        })
        .eq('id', item.id);

      if (error) throw error;

      setPortfolioItems(prevItems =>
        prevItems.map(prevItem =>
          prevItem.id === item.id
            ? { ...prevItem, ...formData }
            : prevItem
        )
      );

      toast({
        title: "Success",
        description: "Portfolio item updated successfully",
      });

      setEditingId(null);
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update portfolio item",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('portfolio_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPortfolioItems(prevItems => prevItems.filter(item => item.id !== id));
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

  const addNewCard = async () => {
    try {
      const newCard = {
        header: "New Project",
        description: "Click to edit description",
        link: "",
        sort_order: portfolioItems.length,
        user_id: session?.user?.id
      };

      const { data, error } = await supabase
        .from('portfolio_cards')
        .insert([newCard])
        .select()
        .single();

      if (error) throw error;

      setPortfolioItems(prev => [...prev, data]);
      setEditingId(data.id);

      toast({
        title: "Success",
        description: "New portfolio item created",
      });
    } catch (error) {
      console.error('Error adding new card:', error);
      toast({
        title: "Error",
        description: "Failed to create new portfolio item",
        variant: "destructive",
      });
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
          {portfolioItems.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              session={session}
              isEditing={editingId === item.id}
              onEdit={() => setEditingId(item.id)}
              onSave={(formData) => saveChanges(item, formData)}
              onCancel={() => setEditingId(null)}
              onDelete={() => deleteItem(item.id)}
              onClick={() => handlePortfolioClick(item)}
            />
          ))}
        </div>

        {session && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex justify-center"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={addNewCard}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Project
            </Button>
          </motion.div>
        )}
      </div>

      <ProjectDialog
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </section>
  );
};