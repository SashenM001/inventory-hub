import { useState, useEffect } from "react";
import { useInventoryStore } from "@/stores/inventoryStore";
import { itemAdditionsApi } from "@/services/api";
import { InventoryItem } from "@/types/inventory";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function AddStockDialog({
  open,
  onOpenChange,
  item,
}: AddStockDialogProps) {
  const { items, fetchItems, fetchAdditions } = useInventoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>(item?.id || "");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");
  const [notes, setNotes] = useState("");

  const itemOptions = items.map(
    (itm) => `${itm.name} (Current: ${itm.quantity})`,
  );

  const handleItemSelect = (selectedLabel: string) => {
    const itemIndex = items.findIndex(
      (itm) => `${itm.name} (Current: ${itm.quantity})` === selectedLabel,
    );
    if (itemIndex >= 0) {
      setSelectedItemId(items[itemIndex].id);
    }
  };

  const getSelectedItemLabel = () => {
    if (!selectedItemId) return "";
    const itm = items.find((i) => i.id === selectedItemId);
    return itm ? `${itm.name} (Current: ${itm.quantity})` : "";
  };

  const currentItem = selectedItemId
    ? items.find((i) => i.id === selectedItemId) || item
    : item;

  useEffect(() => {
    if (!open) {
      setQuantity("");
      setSupplier("");
      setNotes("");
      if (!item) {
        setSelectedItemId("");
      }
    } else if (item) {
      setSelectedItemId(item.id);
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItemId) {
      toast.error("Please select an item");
      return;
    }

    const qty = parseInt(quantity) || 0;

    if (!quantity || qty <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    setIsLoading(true);
    try {
      // Call backend API to add stock
      await itemAdditionsApi.addItem({
        itemId: selectedItemId,
        quantity: qty,
        supplierId: supplier || undefined,
        notes: notes || undefined,
      });

      // Refresh items and additions from backend
      await fetchItems();
      await fetchAdditions();

      toast.success(
        `Stock updated: Added ${qty} unit(s) to ${currentItem?.name}`,
      );
      onOpenChange(false);
      setQuantity("");
      setSupplier("");
      setNotes("");
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error(
        `Failed to add stock: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Add Stock</DialogTitle>
          <DialogDescription>
            Update stock quantity for inventory items
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Selection */}
          <div className="space-y-2">
            <Label htmlFor="item-select" className="font-medium">
              Select Item <span className="text-destructive">*</span>
            </Label>
            <Combobox
              items={itemOptions}
              value={getSelectedItemLabel()}
              onValueChange={handleItemSelect}
              placeholder="Search and select an item..."
            />
          </div>

          {/* Quantity & Supplier */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="font-medium">
                Quantity to Add <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                disabled={!selectedItemId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier" className="font-medium">
                Supplier
              </Label>
              <Input
                id="supplier"
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Supplier name (optional)"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-medium">
              Notes
            </Label>
            <Input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Purchase reference, date, etc. (optional)"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !quantity || !selectedItemId}
            >
              {isLoading ? "Adding Stock..." : "Add Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
