import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageSquare, MousePointerClick, Trash2, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type PopularCard = {
  header: string;
  clicks: number;
};

const SortableCard = ({ card, index }: { card: PopularCard; index: number }) => {
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

export const DashboardStats = ({
  totalClicks,
  totalMessages,
  latestMessages,
  clicksData,
  popularCards,
  onDeleteMessage,
}: {
  totalClicks: number;
  totalMessages: number;
  latestMessages: ContactMessage[];
  clicksData: { date: string; clicks: number; }[];
  popularCards: PopularCard[];
  onDeleteMessage: (id: number) => Promise<void>;
}) => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [cards, setCards] = useState(popularCards);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.header === active.id);
        const newIndex = items.findIndex((item) => item.header === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });

      try {
        // Update sort order in the database
        const { error } = await supabase
          .from('portfolio_cards')
          .update({ sort_order: cards.findIndex(card => card.header === active.id) })
          .eq('header', active.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Card order updated successfully",
        });
      } catch (error) {
        console.error('Error updating sort order:', error);
        toast({
          title: "Error",
          description: "Failed to update card order",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Popular Portfolio Items
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{totalClicks} total clicks</div>
            <ScrollArea className="h-[200px]">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={cards.map(card => card.header)}
                  strategy={verticalListSortingStrategy}
                >
                  {cards.map((card, index) => (
                    <SortableCard key={card.header} card={card} index={index} />
                  ))}
                </SortableContext>
              </DndContext>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Click Activity
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clicksData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="clicks" 
                    fill="currentColor" 
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Latest Contact Messages
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">{totalMessages} total</div>
          <ScrollArea className="h-[200px]">
            {latestMessages.map((message) => (
              <div
                key={message.id}
                className="mb-4 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium">{message.name}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMessage(message.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {message.message}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(new Date(message.created_at), 'MMM dd, yyyy')}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="font-medium">Email:</div>
              <div className="text-muted-foreground">{selectedMessage?.email}</div>
            </div>
            <div>
              <div className="font-medium">Message:</div>
              <div className="text-muted-foreground whitespace-pre-wrap">
                {selectedMessage?.message}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Sent on {selectedMessage && format(new Date(selectedMessage.created_at), 'MMM dd, yyyy HH:mm')}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};