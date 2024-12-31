import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";

type StaticPortfolioContentProps = {
  item: any;
  onClick: () => void;
};

export const StaticPortfolioContent = ({ item, onClick }: StaticPortfolioContentProps) => {
  const { toast } = useToast();

  const handleExternalClick = async () => {
    try {
      await supabase
        .from('portfolio_clicks')
        .insert([{ 
          project_title: item.header,
        }]);
    } catch (error) {
      console.error('Error tracking external click:', error);
      toast({
        title: "Error",
        description: "Failed to track portfolio click",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CardHeader className="p-0">
        <CardTitle className="text-2xl mb-6">{item.header}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
          {item.description}
        </p>
      </CardContent>
      <div className="flex gap-4">
        <Button
          variant="default"
          className="w-fit"
          onClick={onClick}
        >
          View in App
        </Button>
        <Button
          variant="outline"
          className="w-fit"
          onClick={handleExternalClick}
          asChild
        >
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            Open in New Tab <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </>
  );
};