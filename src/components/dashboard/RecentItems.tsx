import { Link } from "react-router-dom";
import { ArrowRight, Package, AlertTriangle } from "lucide-react";
import { useInventoryStore } from "@/stores/inventoryStore";
import { getStockStatus } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RecentItems() {
  const { items } = useInventoryStore();

  // Get the 5 most recently updated items
  const recentItems = [...items]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  const getStatusBadge = (quantity: number, minQuantity: number) => {
    const status = getStockStatus(quantity, minQuantity);
    const statusConfig = {
      "in-stock": { label: "In Stock", className: "bg-success/10 text-success border-success/20" },
      "low-stock": { label: "Low Stock", className: "bg-warning/10 text-warning border-warning/20" },
      "out-of-stock": { label: "Out of Stock", className: "bg-destructive/10 text-destructive border-destructive/20" },
    };
    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={cn("text-xs", config.className)}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="card-elevated animate-slide-in-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Recent Items
          </CardTitle>
          <CardDescription>Recently updated inventory items</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/inventory" className="gap-1">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  {item.category} · {item.quantity} units
                </div>
              </div>
              {getStatusBadge(item.quantity, item.minQuantity)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
