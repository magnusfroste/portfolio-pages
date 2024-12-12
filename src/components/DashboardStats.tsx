import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageSquare, MousePointerClick, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const { toast } = useToast();

  return (
    <div className="space-y-4">
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
            {popularCards.map((card, index) => (
              <div
                key={card.header}
                className="mb-4 p-3 border rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">
                    {index + 1}. {card.header}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {card.clicks} clicks
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

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