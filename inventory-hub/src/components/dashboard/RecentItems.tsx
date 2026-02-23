import { Link } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { useInventoryStore } from "@/stores/inventoryStore";
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
  const { issues, additions } = useInventoryStore();

  // Combine issues and additions, sort by date (most recent first)
  const allTransactions = [
    ...additions.map((add) => ({
      ...add,
      type: "addition" as const,
      date: add.addedAt,
    })),
    ...issues.map((issue) => ({
      ...issue,
      type: "issue" as const,
      date: issue.issuedAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="card-elevated animate-slide-in-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Stock Transactions
          </CardTitle>
          <CardDescription>
            Recent stock in and stock out records
          </CardDescription>
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
          {allTransactions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            allTransactions.map((transaction, idx) => (
              <div
                key={`${transaction.type}-${idx}`}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {transaction.type === "addition" ? (
                    <ArrowUpRight className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-destructive flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {transaction.itemName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div
                      className={cn(
                        "font-semibold text-sm",
                        transaction.type === "addition"
                          ? "text-success"
                          : "text-destructive",
                      )}
                    >
                      {transaction.type === "addition" ? "+" : "-"}
                      {transaction.quantity}
                    </div>
                    {transaction.type === "addition" ? (
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success border-success/20 text-xs"
                      >
                        Add Stock
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-destructive/10 text-destructive border-destructive/20 text-xs"
                      >
                        Issue Item
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
