
import { Navigation } from "@/components/Navigation";
import { DashboardStats } from "@/components/DashboardStats";
import { RawClicksTable } from "@/components/dashboard/RawClicksTable";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const {
    isLoading,
    totalClicks,
    totalMessages,
    latestMessages,
    clicksData,
    popularCards,
    rawClicks,
    handleDeleteMessage,
  } = useDashboardData();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Navigation />
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Navigation />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <DashboardStats
        totalClicks={totalClicks}
        totalMessages={totalMessages}
        latestMessages={latestMessages}
        clicksData={clicksData}
        popularCards={popularCards}
        onDeleteMessage={handleDeleteMessage}
      />

      <RawClicksTable rawClicks={rawClicks} />
    </div>
  );
};

export default Dashboard;
