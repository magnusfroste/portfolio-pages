import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ContactMessage } from "@/hooks/useDashboardData";

interface MessagesListProps {
  messages: ContactMessage[];
  onMessageClick: (message: ContactMessage) => void;
  onDeleteMessage: (id: number) => void;
}

export const MessagesList = ({ messages, onMessageClick, onDeleteMessage }: MessagesListProps) => {
  return (
    <ScrollArea className="h-[400px]">
      {messages.map((message) => (
        <div
          key={message.id}
          className="mb-4 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onMessageClick(message)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium text-lg">{message.name}</div>
              <div className="text-sm text-muted-foreground">{message.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={message.status === "unread" ? "default" : "secondary"}>
                {message.status}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Delete button clicked for message ID: ${message.id}`);
                  onDeleteMessage(message.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {message.message}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-muted-foreground">
              {format(new Date(message.created_at), 'MMM dd, yyyy HH:mm')}
            </div>
            {message.user_id && (
              <div className="text-xs text-muted-foreground">
                User ID: {message.user_id}
              </div>
            )}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
