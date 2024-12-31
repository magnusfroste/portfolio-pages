import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, MousePointerClick } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  arrayMove,
} from "@dnd-kit/sortable";
import { SortablePortfolioCard } from "./dashboard/SortablePortfolioCard";
import { MessagesList } from "./dashboard/MessagesList";
import { DailyClicksChart } from "./dashboard/DailyClicksChart";

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={cards.map(card => card.header)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {cards.map((card, index) => (
                    <SortablePortfolioCard key={card.header} card={card} index={index} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>

        <DailyClicksChart clicksData={clicksData} />
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
          <MessagesList 
            messages={latestMessages}
            onMessageClick={setSelectedMessage}
            onDeleteMessage={onDeleteMessage}
          />
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