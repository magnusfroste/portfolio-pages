import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DashboardStats } from "@/components/DashboardStats";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type ClickData = {
  date: string;
  clicks: number;
};

type PopularCard = {
  header: string;
  clicks: number;
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [latestMessages, setLatestMessages] = useState<ContactMessage[]>([]);
  const [clicksData, setClicksData] = useState<ClickData[]>([]);
  const [popularCards, setPopularCards] = useState<PopularCard[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total clicks
        const { count: clicksCount, error: clicksError } = await supabase
          .from('portfolio_clicks')
          .select('*', { count: 'exact' });

        if (clicksError) throw clicksError;
        setTotalClicks(clicksCount || 0);

        // Fetch clicks data for chart
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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

        // Fetch total messages and latest messages
        const { count: messagesCount, error: messagesCountError } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact' });

        if (messagesCountError) throw messagesCountError;
        setTotalMessages(messagesCount || 0);

        const { data: latestMessagesData, error: latestMessagesError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (latestMessagesError) throw latestMessagesError;
        setLatestMessages(latestMessagesData || []);

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

    fetchData();
  }, [toast]);

  const handleDeleteMessage = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate("/dashboard/cards")}>
          Manage Portfolio Cards
        </Button>
      </div>

      <DashboardStats
        totalClicks={totalClicks}
        totalMessages={totalMessages}
        latestMessages={latestMessages}
        clicksData={clicksData}
        popularCards={popularCards}
        onDeleteMessage={handleDeleteMessage}
      />
    </div>
  );
};

export default Dashboard;