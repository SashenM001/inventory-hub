import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { useInventoryStore } from "@/stores/inventoryStore";
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
import { toast } from "sonner";

interface AdjustQuantityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function AdjustQuantityDialog({
  open,
  onOpenChange,
  item,
}: AdjustQuantityDialogProps) {
  const { adjustQuantity } = useInventoryStore();
  const [adjustment, setAdjustment] = useState(0);

  useEffect(() => {
    if (open) {
      setAdjustment(0);
    }
  }, [open]);

  if (!item) return null;

  const newQuantity = Math.max(0, item.quantity + adjustment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjustment !== 0) {
      adjustQuantity(item.id, adjustment);
      toast.success(`Quantity adjusted for ${item.name}`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Adjust Quantity</DialogTitle>
          <DialogDescription>
            Adjust the stock quantity for <span className="font-medium">{item.name}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">Current Quantity</div>
            <div className="text-4xl font-serif font-semibold">{item.quantity}</div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => setAdjustment(adjustment - 1)}
              disabled={item.quantity + adjustment <= 0}
            >
              <Minus className="w-5 h-5" />
            </Button>
            <div className="flex flex-col items-center min-w-[100px]">
              <Input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                className="text-center text-lg font-medium w-24"
              />
              <span className="text-xs text-muted-foreground mt-1">
                {adjustment > 0 ? "+" : ""}{adjustment}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => setAdjustment(adjustment + 1)}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="text-center py-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">New Quantity</div>
            <div className="text-3xl font-serif font-semibold text-primary">
              {newQuantity}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={adjustment === 0}>
              Update Quantity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
