import { motion } from "framer-motion";
import { ExternalLink, Edit, Plus, Image as ImageIcon, Trash2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { ProjectDialog } from "./ProjectDialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { ImageUploadField } from "./ImageUploadField";
import { useForm } from "react-hook-form";

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
  const [session, setSession] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();
  const form = useForm();

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
    if (editingId === project.id) return;
    
    try {
      await supabase
        .from('portfolio_clicks')
        .insert([{ project_title: project.header }]);
      
      setSelectedProject(project);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const startEditing = (item: PortfolioCard) => {
    setEditingId(item.id);
    form.reset({
      header: item.header,
      description: item.description,
      link: item.link,
      image_url: item.image_url,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    form.reset();
  };

  const saveChanges = async (item: PortfolioCard) => {
    const formData = form.getValues();
    try {
      const { error } = await supabase
        .from('portfolio_cards')
        .update({
          header: formData.header,
          description: formData.description,
          link: formData.link,
          image_url: formData.image_url,
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
      };

      const { data, error } = await supabase
        .from('portfolio_cards')
        .insert([newCard])
        .select()
        .single();

      if (error) throw error;

      setPortfolioItems(prev => [...prev, data]);
      setEditingId(data.id);
      form.reset(newCard);

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
                      {editingId === item.id ? (
                        <ImageUploadField form={form} initialImageUrl={item.image_url} />
                      ) : (
                        item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.header}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                            loading="lazy"
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="p-12 flex flex-col justify-between">
                    <div>
                      <CardHeader className="p-0">
                        {editingId === item.id ? (
                          <Input
                            {...form.register('header')}
                            defaultValue={item.header}
                            className="text-2xl font-bold mb-6"
                          />
                        ) : (
                          <CardTitle className="text-2xl mb-6">{item.header}</CardTitle>
                        )}
                      </CardHeader>
                      <CardContent className="p-0">
                        {editingId === item.id ? (
                          <Textarea
                            {...form.register('description')}
                            defaultValue={item.description}
                            className="mb-10 text-lg leading-relaxed"
                          />
                        ) : (
                          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </CardContent>
                    </div>
                    <div className="flex gap-4">
                      {session && (
                        <>
                          {editingId === item.id ? (
                            <>
                              <Button
                                variant="default"
                                onClick={() => saveChanges(item)}
                                className="w-fit"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                onClick={cancelEditing}
                                className="w-fit"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => startEditing(item)}
                                className="w-fit"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteItem(item.id)}
                                className="w-fit"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </>
                          )}
                        </>
                      )}
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