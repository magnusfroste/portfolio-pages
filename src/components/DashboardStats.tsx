import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MessagesList } from "./dashboard/MessagesList";
import { DailyClicksChart } from "./dashboard/DailyClicksChart";
import { ContactMessage, ClickData, PopularCard } from "@/hooks/useDashboardData";

type PortfolioCard = {
  id: number;
  header: string;
  description: string;
  link: string;
  image_url?: string;
  sort_order: number;
  user_id?: string;
  created_at?: string;
};

interface DashboardStatsProps {
  totalClicks: number;
  totalMessages: number;
  latestMessages: ContactMessage[];
  clicksData: ClickData[];
  popularCards: PopularCard[];
  onDeleteMessage: (id: number) => Promise<void>;
}

export const DashboardStats = ({
  clicksData,
  latestMessages,
  onDeleteMessage
}: DashboardStatsProps) => {
  const [cards, setCards] = useState<PortfolioCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_cards')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCards(items);

    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        header: item.header,
        description: item.description,
        link: item.link,
        image_url: item.image_url,
        sort_order: index,
        user_id: item.user_id
      }));

      const { error } = await supabase
        .from('portfolio_cards')
        .upsert(updates);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  };

  const handleMessageClick = (message: ContactMessage) => {
    console.log('Message clicked:', message);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Portfolio Items Order</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="cards">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {cards.map((card, index) => (
                    <Draggable
                      key={card.id.toString()}
                      draggableId={card.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 bg-white rounded shadow"
                        >
                          {card.header}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Daily Portfolio Clicks</h2>
          <DailyClicksChart clicksData={clicksData} />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Messages</h2>
        <MessagesList 
          messages={latestMessages}
          onMessageClick={handleMessageClick}
          onDeleteMessage={onDeleteMessage}
        />
      </Card>
    </div>
  );
};
