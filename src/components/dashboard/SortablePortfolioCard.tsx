import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type PopularCard = {
  header: string;
  clicks: number;
};

interface SortableCardProps {
  card: PopularCard;
  index: number;
}

export const SortablePortfolioCard = ({ card, index }: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.header });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 p-3 border rounded-lg"
    >
      <div className="flex justify-between items-start">
        <div className="font-medium flex items-center gap-2">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          {index + 1}. {card.header}
        </div>
        <div className="text-sm text-muted-foreground">
          {card.clicks} clicks
        </div>
      </div>
    </div>
  );
};