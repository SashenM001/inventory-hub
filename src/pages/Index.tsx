import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentItems } from "@/components/dashboard/RecentItems";
import { LowStockAlerts } from "@/components/dashboard/LowStockAlerts";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your inventory management system
          </p>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentItems />
          <LowStockAlerts />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
