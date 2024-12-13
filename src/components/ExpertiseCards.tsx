import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus, X, GripVertical } from "lucide-react";
import { useExpertiseAreas, ExpertiseArea } from "@/hooks/useExpertiseAreas";
import { supabase } from "@/integrations/supabase/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableCard = ({ area, index, onRemove, session }: { 
  area: ExpertiseArea; 
  index: number;
  onRemove: () => void;
  session: any;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 h-full hover:shadow-lg transition-shadow relative">
        {session && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
            <div 
              {...attributes} 
              {...listeners}
              className="absolute top-2 left-2 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </>
        )}
        <h3 className="text-xl font-semibold mb-3 mt-6">{area.title}</h3>
        <p className="text-muted-foreground">{area.description}</p>
      </Card>
    </motion.div>
  );
};

export const ExpertiseCards = () => {
  const [session, setSession] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newArea, setNewArea] = useState<ExpertiseArea>({ title: "", description: "" });
  
  const {
    expertiseAreas,
    isLoading,
    addExpertiseArea,
    removeExpertiseArea,
    reorderExpertiseAreas,
  } = useExpertiseAreas(session);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newArea.title && newArea.description) {
      await addExpertiseArea(newArea);
      setNewArea({ title: "", description: "" });
      setIsAdding(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      reorderExpertiseAreas(active.id as number, over.id as number);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Loading...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Areas of Expertise</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <SortableContext 
            items={expertiseAreas.map((_, index) => index)}
            strategy={verticalListSortingStrategy}
          >
            {expertiseAreas.map((area, index) => (
              <SortableCard
                key={index}
                area={area}
                index={index}
                onRemove={() => removeExpertiseArea(index)}
                session={session}
              />
            ))}
          </SortableContext>

          {session && !isAdding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className="p-6 h-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-8 w-8 text-muted-foreground" />
              </Card>
            </motion.div>
          )}

          {session && isAdding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 h-full">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={newArea.title}
                    onChange={(e) => setNewArea({ ...newArea, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newArea.description}
                    onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">Add</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setNewArea({ title: "", description: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </div>
      </DndContext>
    </section>
  );
};