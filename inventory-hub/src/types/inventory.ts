export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplierId: string;
  supplierName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemIssue {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  reason: string;
  issuedTo: string;
  notes: string;
  issuedAt: Date;
}

export interface ItemAddition {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  supplierId: string;
  supplierName: string;
  notes: string;
  addedAt: Date;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export const getStockStatus = (quantity: number, minQuantity: number): StockStatus => {
  if (quantity === 0) return 'out-of-stock';
  if (quantity <= minQuantity) return 'low-stock';
  return 'in-stock';
};
