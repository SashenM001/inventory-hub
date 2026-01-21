import { MainLayout } from "@/components/layout/MainLayout";
import { SupplierList } from "@/components/suppliers/SupplierList";

const SuppliersPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-foreground">Suppliers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your supplier contacts and information
          </p>
        </div>

        {/* Supplier List */}
        <SupplierList />
      </div>
    </MainLayout>
  );
};

export default SuppliersPage;
