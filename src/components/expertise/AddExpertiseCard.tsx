import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { ExpertiseArea } from "@/hooks/useExpertiseAreas";

interface AddExpertiseCardProps {
  isAdding: boolean;
  newArea: ExpertiseArea;
  onAdd: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (field: keyof ExpertiseArea, value: string) => void;
}

export const AddExpertiseCard = ({ 
  isAdding, 
  newArea, 
  onAdd, 
  onCancel, 
  onChange 
}: AddExpertiseCardProps) => {
  if (!isAdding) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card
          className="p-6 h-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          onClick={onCancel}
        >
          <Plus className="h-8 w-8 text-muted-foreground" />
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6 h-full">
        <form onSubmit={onAdd} className="space-y-4">
          <Input
            placeholder="Title"
            value={newArea.title}
            onChange={(e) => onChange('title', e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={newArea.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
          <div className="flex gap-2">
            <Button type="submit">Add</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};