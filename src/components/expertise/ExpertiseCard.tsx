import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExpertiseArea } from "@/hooks/useExpertiseAreas";

interface ExpertiseCardProps {
  area: ExpertiseArea;
  index: number;
  onRemove: () => void;
  session: any;
}

export const ExpertiseCard = ({ area, index, onRemove, session }: ExpertiseCardProps) => {
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