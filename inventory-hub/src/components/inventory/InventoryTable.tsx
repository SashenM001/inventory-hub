import { useState } from "react";
import { Plus, Minus, Trash2, Edit, Search, LogOut } from "lucide-react";
import { useInventoryStore } from "@/stores/inventoryStore";
import { getStockStatus, InventoryItem } from "@/types/inventory";
import { ITEM_CATEGORIES } from "@/constants/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddStockDialog } from "./AddStockDialog";
import { AdjustQuantityDialog } from "./AdjustQuantityDialog";
import { ItemIssueDialog } from "./ItemIssueDialog";
import { cn } from "@/lib/utils";

export function InventoryTable() {
  const { items, deleteItem } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [addStockDialogOpen, setAddStockDialogOpen] = useState(false);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const DELETION_PASSWORD = "112233";

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item);
    setPasswordInput("");
    setPasswordError("");
    setPasswordDialogOpen(true);
  };

  const verifyPassword = () => {
    if (passwordInput === DELETION_PASSWORD) {
      setPasswordDialogOpen(false);
      setDeleteDialogOpen(true);
    } else {
      setPasswordError("Invalid password. Please try again.");
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAdjustClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustDialogOpen(true);
  };

  const getStatusBadge = (item: InventoryItem) => {
    const status = getStockStatus(item.quantity, item.minQuantity);
    const statusConfig = {
      "in-stock": {
        label: "In Stock",
        className: "bg-success/10 text-success border-success/20",
      },
      "low-stock": {
        label: "Low Stock",
        className: "bg-warning/10 text-warning border-warning/20",
      },
      "out-of-stock": {
        label: "Out of Stock",
        className: "bg-destructive/10 text-destructive border-destructive/20",
      },
    };
    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={cn("font-medium", config.className)}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            onClick={() => setCategoryFilter("all")}
            className="rounded-full"
          >
            All
          </Button>
          {ITEM_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              onClick={() => setCategoryFilter(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 sm:justify-end">
          <Button
            onClick={() => {
              setSelectedItem(null);
              setIssueDialogOpen(true);
            }}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Issue Item
          </Button>
          <Button
            onClick={() => {
              setSelectedItem(null);
              setAddStockDialogOpen(true);
            }}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card shadow-soft overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Item</TableHead>
              <TableHead className="font-semibold">SKU</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold text-right">Qty</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id} className="table-row-hover">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {item.sku}
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.supplierName}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.quantity}
                  </TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleAdjustClick(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <AdjustQuantityDialog
        open={adjustDialogOpen}
        onOpenChange={setAdjustDialogOpen}
        item={selectedItem}
      />
      <ItemIssueDialog
        open={issueDialogOpen}
        onOpenChange={setIssueDialogOpen}
        item={selectedItem}
      />
      <AddStockDialog
        open={addStockDialogOpen}
        onOpenChange={setAddStockDialogOpen}
        item={selectedItem}
      />
      <AlertDialog
        open={passwordDialogOpen}
        onOpenChange={(open) => {
          setPasswordDialogOpen(open);
          if (!open) {
            setPasswordError("");
            setPasswordInput("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter the password to proceed with deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
              className={passwordError ? "border-destructive" : ""}
              autoFocus
            />
            {passwordError && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm font-semibold text-destructive">
                  {passwordError}
                </p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={verifyPassword}
              className="bg-primary hover:bg-primary/90"
            >
              Verify
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
