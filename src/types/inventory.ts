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

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export const getStockStatus = (quantity: number, minQuantity: number): StockStatus => {
  if (quantity === 0) return 'out-of-stock';
  if (quantity <= minQuantity) return 'low-stock';
  return 'in-stock';
};
