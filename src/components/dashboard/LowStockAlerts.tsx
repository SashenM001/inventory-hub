import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle } from "lucide-react";
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
import { cn } from "@/lib/utils";

export function LowStockAlerts() {
  const { items } = useInventoryStore();

  // Get items that are low stock or out of stock
  const alertItems = items
    .filter((item) => {
      const status = getStockStatus(item.quantity, item.minQuantity);
      return status === "low-stock" || status === "out-of-stock";
    })
    .slice(0, 5);

  return (
    <Card className="card-elevated animate-slide-in-up" style={{ animationDelay: "100ms" }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Stock Alerts
          </CardTitle>
          <CardDescription>Items requiring attention</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/inventory" className="gap-1">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {alertItems.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>All items are well stocked</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertItems.map((item) => {
              const isOutOfStock = item.quantity === 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Min: {item.minQuantity} units
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-right font-medium",
                      isOutOfStock ? "text-destructive" : "text-warning"
                    )}
                  >
                    {item.quantity} left
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
