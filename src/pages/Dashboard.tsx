import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageSquare, MousePointerClick } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

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

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [latestMessages, setLatestMessages] = useState<ContactMessage[]>([]);
  const [clicksData, setClicksData] = useState<ClickData[]>([]);
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Portfolio Clicks
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <div className="h-[200px] mt-4">
              <ChartContainer
                config={{
                  clicks: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
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
                    />
                    <Bar
                      dataKey="clicks"
                      fill="currentColor"
                      radius={[4, 4, 0, 0]}
                      className="fill-primary"
                    />
                    <ChartTooltip>
                      <ChartTooltipContent />
                    </ChartTooltip>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
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
                  className="mb-4 p-3 border rounded-lg"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium">{message.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(message.created_at), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {message.message}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;