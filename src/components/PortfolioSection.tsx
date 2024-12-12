import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectDialog } from "./ProjectDialog";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioHeader } from "./portfolio/PortfolioHeader";
import { AddPortfolioButton } from "./portfolio/AddPortfolioButton";
import { usePortfolioItems } from "./portfolio/usePortfolioItems";

export const PortfolioSection = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

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

  const {
    portfolioItems,
    isLoading,
    addNewCard,
    deleteItem,
    updateItem
  } = usePortfolioItems(session);

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

  const handleAddNewCard = async () => {
    const newId = await addNewCard();
    if (newId) {
      setEditingId(newId);
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
        <PortfolioHeader />
        
        <div className="space-y-8">
          {portfolioItems.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              session={session}
              isEditing={editingId === item.id}
              onEdit={() => setEditingId(item.id)}
              onSave={(formData) => updateItem(item, formData)}
              onCancel={() => setEditingId(null)}
              onDelete={() => deleteItem(item.id)}
              onClick={() => handlePortfolioClick(item)}
            />
          ))}
        </div>

        {session && (
          <AddPortfolioButton onAdd={handleAddNewCard} />
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