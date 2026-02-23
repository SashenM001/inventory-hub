import { useState, useEffect } from "react";
import { useInventoryStore } from "@/stores/inventoryStore";
import { itemIssuesApi } from "@/services/api";
import { InventoryItem } from "@/types/inventory";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";

interface ItemIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

const ISSUE_REASONS = [
  "Service - Deceased preparation",
  "Service - Funeral ceremony",
  "Service - Viewing arrangement",
  "Service - Arrangement consultation",
  "Maintenance - Equipment repair",
  "Maintenance - Stock rotation",
  "Administrative - Documentation",
  "Administrative - Record keeping",
  "Disposal - Expired items",
  "Disposal - Damaged items",
  "Other",
];

export function ItemIssueDialog({
  open,
  onOpenChange,
  item,
}: ItemIssueDialogProps) {
  const { items, fetchItems, fetchIssues } = useInventoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>(item?.id || "");
  const [formData, setFormData] = useState({
    quantity: "",
    reason: "",
    issuedTo: "",
    notes: "",
  });
  const [quantityError, setQuantityError] = useState("");

  const itemOptions = items.map(
    (itm) => `${itm.name} (Available: ${itm.quantity})`,
  );

  const handleItemSelect = (selectedLabel: string) => {
    const itemIndex = items.findIndex(
      (itm) => `${itm.name} (Available: ${itm.quantity})` === selectedLabel,
    );
    if (itemIndex >= 0) {
      setSelectedItemId(items[itemIndex].id);
    }
  };

  const getSelectedItemLabel = () => {
    if (!selectedItemId) return "";
    const itm = items.find((i) => i.id === selectedItemId);
    return itm ? `${itm.name} (Available: ${itm.quantity})` : "";
  };

  const currentItem = selectedItemId
    ? items.find((i) => i.id === selectedItemId) || item
    : item;

  useEffect(() => {
    if (!open) {
      setFormData({
        quantity: "",
        reason: "",
        issuedTo: "",
        notes: "",
      });
      setQuantityError("");
      if (!item) {
        setSelectedItemId("");
      }
    } else if (item) {
      setSelectedItemId(item.id);
    }
  }, [open, item]);

  const handleQuantityChange = (value: string) => {
    const qty = parseInt(value) || 0;
    setFormData({ ...formData, quantity: value });

    if (currentItem && qty > currentItem.quantity) {
      setQuantityError(
        `Cannot issue more than available quantity (${currentItem.quantity})`,
      );
    } else if (qty <= 0) {
      setQuantityError("Quantity must be greater than 0");
    } else {
      setQuantityError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItemId) {
      toast.error("Please select an item to issue");
      return;
    }

    const quantity = parseInt(formData.quantity) || 0;

    if (!formData.quantity || quantity <= 0) {
      setQuantityError("Quantity must be greater than 0");
      return;
    }

    if (currentItem && quantity > currentItem.quantity) {
      setQuantityError(
        `Cannot issue more than available quantity (${currentItem.quantity})`,
      );
      return;
    }

    if (!formData.issuedTo.trim()) {
      toast.error("Please specify who this item is being issued to");
      return;
    }

    setIsLoading(true);
    try {
      // Call backend API to issue item
      await itemIssuesApi.issueItem({
        itemId: selectedItemId,
        quantity: quantity,
        reason: formData.reason,
        issuedTo: formData.issuedTo,
        notes: formData.notes,
      });

      // Refresh items and issues from backend
      await fetchItems();
      await fetchIssues();

      toast.success(
        `${quantity} unit(s) of ${currentItem?.name} issued successfully`,
      );
      onOpenChange(false);
      setFormData({
        quantity: "",
        reason: "",
        issuedTo: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error issuing item:", error);
      toast.error(
        `Failed to issue item: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Issue Item</DialogTitle>
          <DialogDescription>
            Record the issue of inventory items (use search to find items)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Selection with Search */}
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

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="font-medium">
              Quantity <span className="text-destructive">*</span>
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={currentItem?.quantity || 0}
              value={formData.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder="Enter quantity"
              className={quantityError ? "border-destructive" : ""}
              disabled={!selectedItemId}
            />
            {quantityError && (
              <p className="text-xs text-destructive font-medium">
                {quantityError}
              </p>
            )}
          </div>

          {/* Issued To */}
          <div className="space-y-2">
            <Label htmlFor="issuedTo" className="font-medium">
              Issued To <span className="text-destructive">*</span>
            </Label>
            <Input
              id="issuedTo"
              type="text"
              value={formData.issuedTo}
              onChange={(e) =>
                setFormData({ ...formData, issuedTo: e.target.value })
              }
              placeholder="Person name or department"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Optional additional information..."
              rows={2}
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
              disabled={
                isLoading ||
                !formData.quantity ||
                quantityError !== "" ||
                !selectedItemId
              }
            >
              {isLoading ? "Issuing..." : "Issue Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
