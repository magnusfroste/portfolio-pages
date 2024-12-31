import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

interface MessagesListProps {
  messages: ContactMessage[];
  onMessageClick: (message: ContactMessage) => void;
  onDeleteMessage: (id: number) => void;
}

export const MessagesList = ({ messages, onMessageClick, onDeleteMessage }: MessagesListProps) => {
  return (
    <ScrollArea className="h-[200px]">
      {messages.map((message) => (
        <div
          key={message.id}
          className="mb-4 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onMessageClick(message)}
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
  );
};