import { MainLayout } from "@/components/layout/MainLayout";
import { InventoryTable } from "@/components/inventory/InventoryTable";

const InventoryPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-foreground">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Manage your inventory items, adjust quantities, and track stock levels
          </p>
        </div>

        {/* Inventory Table */}
        <InventoryTable />
      </div>
    </MainLayout>
  );
};

export default InventoryPage;
