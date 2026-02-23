import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useInventoryStore } from "@/stores/inventoryStore";
import { getStockStatus } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownLeft, ArrowUpRight, Filter, Printer } from "lucide-react";

type TimePeriod = "daily" | "weekly" | "monthly" | "all" | "low-stocks" | "out-of-stock";

const SummaryPage = () => {
  const { additions, issues, items } = useInventoryStore();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");

  const getDateRange = (period: TimePeriod) => {
    const now = new Date();
    const start = new Date();

    switch (period) {
      case "daily":
        start.setDate(now.getDate() - 1);
        break;
      case "weekly":
        start.setDate(now.getDate() - 7);
        break;
      case "monthly":
        start.setMonth(now.getMonth() - 1);
        break;
      case "all":
      case "low-stocks":
      case "out-of-stock":
        start.setFullYear(2000);
        break;
    }

    return { start, end: now };
  };

  const filterByPeriod = (items: any[], dateField: string) => {
    const { start, end } = getDateRange(timePeriod);
    return items.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  const filteredAdditions = filterByPeriod(additions, "addedAt");
  const filteredIssues = filterByPeriod(issues, "issuedAt");

  // Combine and sort transactions by date (most recent first)
  const combinedTransactions = [
    ...filteredAdditions.map((add) => ({ ...add, type: "addition", date: new Date(add.addedAt) })),
    ...filteredIssues.map((issue) => ({ ...issue, type: "issue", date: new Date(issue.issuedAt) })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const timePeriodLabels = {
    daily: "Last 24 Hours",
    weekly: "Last 7 Days",
    monthly: "Last 30 Days",
    all: "All Time",
    "low-stocks": "Low Stock Items",
    "out-of-stock": "Out of Stock Items",
  };

  const handlePrint = () => {
    window.print();
  };

  const getLowStockItems = () => {
    const lowStockItemNames = items
      .filter((item) => {
        const status = getStockStatus(item.quantity, item.minQuantity);
        return status === "low-stock";
      })
      .map((item) => item.name);

    return combinedTransactions.filter((t) =>
      lowStockItemNames.includes(t.itemName)
    );
  };

  const getOutOfStockItems = () => {
    const outOfStockItemNames = items
      .filter((item) => {
        const status = getStockStatus(item.quantity, item.minQuantity);
        return status === "out-of-stock";
      })
      .map((item) => item.name);

    return combinedTransactions.filter((t) =>
      outOfStockItemNames.includes(t.itemName)
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-foreground">Inventory Summary</h1>
          <p className="text-muted-foreground mt-1">
            Track items going in and out of inventory
          </p>
        </div>

        {/* Filter & Actions */}
        <div className="flex justify-between items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            Transaction Records
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {timePeriodLabels[timePeriod]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                {(["daily", "weekly", "monthly", "all", "low-stocks", "out-of-stock"] as TimePeriod[]).map(
                  (period) => (
                    <DropdownMenuItem
                      key={period}
                      onClick={() => setTimePeriod(period)}
                      className={timePeriod === period ? "bg-muted" : ""}
                    >
                      {timePeriodLabels[period]}
                    </DropdownMenuItem>
                  ),
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="border rounded-lg bg-card shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold text-right">
                  Quantity
                </TableHead>
                <TableHead className="font-semibold">Reference</TableHead>
                <TableHead className="font-semibold">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                let displayTransactions = combinedTransactions;
                let emptyMessage = "No transactions for this period";
                
                if (timePeriod === "low-stocks") {
                  displayTransactions = getLowStockItems();
                  emptyMessage = "No low stock items";
                } else if (timePeriod === "out-of-stock") {
                  displayTransactions = getOutOfStockItems();
                  emptyMessage = "No out of stock items";
                }
                
                return displayTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayTransactions.map((transaction) => {
                    if (transaction.type === "addition") {
                      const addition = transaction as any;
                      return (
                        <TableRow
                          key={`add-${addition.id}`}
                          className="table-row-hover"
                        >
                          <TableCell className="text-sm">
                            {formatDate(addition.date)}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-success/10 text-success border-success/20">
                              <ArrowDownLeft className="w-3 h-3 mr-1" />
                              Added
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {addition.itemName}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            +{addition.quantity}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {addition.supplierName}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {addition.notes}
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      const issue = transaction as any;
                      return (
                        <TableRow
                          key={`issue-${issue.id}`}
                          className="table-row-hover"
                        >
                          <TableCell className="text-sm">
                            {formatDate(issue.date)}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                              Issued
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {issue.itemName}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-destructive">
                            -{issue.quantity}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {issue.reason}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {issue.issuedTo}
                            {issue.notes && ` - ${issue.notes}`}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })
                );
              })()}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default SummaryPage;
