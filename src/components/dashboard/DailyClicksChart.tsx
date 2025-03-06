import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";
import { ClickData } from "@/hooks/useDashboardData";

export const DailyClicksChart = ({ clicksData }: { clicksData: ClickData[] }) => {
  // Fill in missing dates with 0 clicks
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'MMM dd');
  }).reverse();

  const filledData = last7Days.map(date => ({
    date,
    clicks: clicksData.find(d => d.date === date)?.clicks || 0
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Daily Click Activity (Last 7 Days)
        </CardTitle>
        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filledData}>
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
  );
};
