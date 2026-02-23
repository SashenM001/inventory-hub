import { Package, Users, AlertTriangle } from "lucide-react";
import { useInventoryStore } from "@/stores/inventoryStore";
import { getStockStatus } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStats() {
  const { items, suppliers } = useInventoryStore();

  const totalItems = items.length;
  const totalSuppliers = suppliers.length;
  const lowStockItems = items.filter(
    (item) => getStockStatus(item.quantity, item.minQuantity) === "low-stock",
  ).length;
  const outOfStockItems = items.filter(
    (item) =>
      getStockStatus(item.quantity, item.minQuantity) === "out-of-stock",
  ).length;

  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      description: "Products in inventory",
      icon: Package,
      iconClassName: "text-primary",
    },
    {
      title: "Suppliers",
      value: totalSuppliers,
      description: "Active suppliers",
      icon: Users,
      iconClassName: "text-primary",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockItems + outOfStockItems,
      description: `${lowStockItems} low, ${outOfStockItems} out of stock`,
      icon: AlertTriangle,
      iconClassName: "text-warning",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="card-interactive"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`w-5 h-5 ${stat.iconClassName}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-serif font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
