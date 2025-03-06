
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: string;
  user_id: string | null;
};

export type ClickData = {
  date: string;
  clicks: number;
};

export type PopularCard = {
  header: string;
  clicks: number;
};

export type RawClick = {
  id: number;
  project_title: string;
  clicked_at: string;
};

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [latestMessages, setLatestMessages] = useState<ContactMessage[]>([]);
  const [clicksData, setClicksData] = useState<ClickData[]>([]);
  const [popularCards, setPopularCards] = useState<PopularCard[]>([]);
  const [rawClicks, setRawClicks] = useState<RawClick[]>([]);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      // Fetch total clicks
      const { count: clicksCount, error: clicksError } = await supabase
        .from('portfolio_clicks')
        .select('*', { count: 'exact' });

      if (clicksError) throw clicksError;
      setTotalClicks(clicksCount || 0);

      // Fetch raw clicks for development table
      const { data: rawClicksData, error: rawClicksError } = await supabase
        .from('portfolio_clicks')
        .select('id, project_title, clicked_at')
        .order('clicked_at', { ascending: false })
        .limit(50);

      if (rawClicksError) throw rawClicksError;
      setRawClicks(rawClicksData || []);

      // Fetch clicks data for chart
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data: clicksData, error: clicksDataError } = await supabase
        .from('portfolio_clicks')
        .select('clicked_at')
        .gte('clicked_at', sevenDaysAgo.toISOString())
        .order('clicked_at', { ascending: true });

      if (clicksDataError) throw clicksDataError;

      // Process clicks data for chart
      const clicksByDate = clicksData?.reduce((acc: { [key: string]: number }, click) => {
        const date = format(new Date(click.clicked_at!), 'MMM dd');
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(clicksByDate || {}).map(([date, clicks]) => ({
        date,
        clicks,
      }));

      setClicksData(chartData);

      // Fetch popular cards
      const { data: popularCardsData, error: popularCardsError } = await supabase
        .from('portfolio_clicks')
        .select('project_title')
        .order('clicked_at', { ascending: false });

      if (popularCardsError) throw popularCardsError;

      const clicksByCard = popularCardsData?.reduce((acc: { [key: string]: number }, click) => {
        acc[click.project_title] = (acc[click.project_title] || 0) + 1;
        return acc;
      }, {});

      const sortedCards = Object.entries(clicksByCard || {})
        .map(([header, clicks]) => ({ header, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

      setPopularCards(sortedCards);

      const { count: messagesCount, error: messagesCountError } = await supabase
        .from('portfolio_messages')
        .select('*', { count: 'exact' });

      if (messagesCountError) throw messagesCountError;
      setTotalMessages(messagesCount || 0);

      const { data: latestMessagesData, error: latestMessagesError } = await supabase
        .from('portfolio_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (latestMessagesError) throw latestMessagesError;
      // Ensure messages have the required status field
      const messagesWithStatus = latestMessagesData?.map(msg => ({
        ...msg,
        status: msg.status || 'unread' // Provide default 'unread' if status is null
      })) || [];
      
      setLatestMessages(messagesWithStatus);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteMessage = async (id: number) => {
    try {
      console.log(`Attempting to delete message with ID: ${id}`);
      
      const { error } = await supabase
        .from('portfolio_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log(`Successfully deleted message with ID: ${id} from Supabase`);
      
      // Update state only after successful deletion from the database
      setLatestMessages(prev => prev.filter(message => message.id !== id));
      setTotalMessages(prev => prev - 1);

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    totalClicks,
    totalMessages,
    latestMessages,
    clicksData,
    popularCards,
    rawClicks,
    handleDeleteMessage,
  };
};
