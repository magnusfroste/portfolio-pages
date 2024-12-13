import { useState } from "react";
import { ExpertiseCard } from "./expertise/ExpertiseCard";
import { AddExpertiseCard } from "./expertise/AddExpertiseCard";
import { useExpertiseAreas, ExpertiseArea } from "@/hooks/useExpertiseAreas";
import { useSession } from "@/hooks/useSession";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const ExpertiseCards = () => {
  const session = useSession();
  const [isAdding, setIsAdding] = useState(false);
  const [newArea, setNewArea] = useState<ExpertiseArea>({ title: "", description: "" });
  
  const {
    expertiseAreas,
    isLoading,
    addExpertiseArea,
    removeExpertiseArea,
    updateExpertiseArea,
    reorderExpertiseAreas,
  } = useExpertiseAreas(session);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newArea.title && newArea.description) {
      await addExpertiseArea(newArea);
      setNewArea({ title: "", description: "" });
      setIsAdding(false);
    }
  };

  const handleChange = (field: keyof ExpertiseArea, value: string) => {
    setNewArea({ ...newArea, [field]: value });
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
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Areas of Expertise</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SortableContext 
              items={expertiseAreas.map((_, index) => index)}
              strategy={verticalListSortingStrategy}
            >
              {expertiseAreas.map((area, index) => (
                <ExpertiseCard
                  key={index}
                  area={area}
                  index={index}
                  onRemove={() => removeExpertiseArea(index)}
                  onUpdate={(updatedArea) => updateExpertiseArea(index, updatedArea)}
                  session={session}
                />
              ))}
            </SortableContext>

            {session && (
              <AddExpertiseCard
                isAdding={isAdding}
                newArea={newArea}
                onAdd={handleSubmit}
                onCancel={() => {
                  setIsAdding(!isAdding);
                  setNewArea({ title: "", description: "" });
                }}
                onChange={handleChange}
              />
            )}
          </div>
        </DndContext>
      </div>
    </section>
  );
};