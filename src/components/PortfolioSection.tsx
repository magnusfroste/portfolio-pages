import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectDialog } from "./ProjectDialog";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioHeader } from "./portfolio/PortfolioHeader";
import { AddPortfolioButton } from "./portfolio/AddPortfolioButton";
import { usePortfolioItems } from "./portfolio/usePortfolioItems";
import { useToast } from "./ui/use-toast";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export const PortfolioSection = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Add a small threshold to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log('Session status:', session ? 'Logged in' : 'Not logged in');
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
    updateItem,
    reorderItems
  } = usePortfolioItems(session);

  const handleDragEnd = async (event: DragEndEvent) => {
    console.log('Drag end event:', event);
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      console.log('No valid drop target or same position');
      return;
    }

    console.log('Reordering from', active.id, 'to', over.id);
    const oldIndex = portfolioItems.findIndex(item => item.id === active.id);
    const newIndex = portfolioItems.findIndex(item => item.id === over.id);
    
    console.log('Old index:', oldIndex, 'New index:', newIndex);
    await reorderItems(oldIndex, newIndex);
  };

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
      toast({
        title: "Error",
        description: "Failed to track portfolio click",
        variant: "destructive",
      });
    }
  };

  const handleAddNewCard = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to add portfolio items",
        variant: "destructive",
      });
      return;
    }

    const newId = await addNewCard();
    if (newId) {
      setEditingId(newId);
    }
  };

  const handleSave = async (item: any, formData: any) => {
    const success = await updateItem(item, formData);
    if (success) {
      setEditingId(null);
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
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={portfolioItems.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-8">
              {portfolioItems.map((item, index) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  session={session}
                  isEditing={editingId === item.id}
                  onEdit={() => setEditingId(item.id)}
                  onSave={(formData) => handleSave(item, formData)}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => deleteItem(item.id)}
                  onClick={() => handlePortfolioClick(item)}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

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