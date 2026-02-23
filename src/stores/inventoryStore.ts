import { create } from 'zustand';
import { InventoryItem, Supplier } from '@/types/inventory';

interface InventoryState {
  items: InventoryItem[];
  suppliers: Supplier[];
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  adjustQuantity: (id: string, adjustment: number) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  deleteSupplier: (id: string) => void;
}

// Sample data
const sampleSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechPro Supplies',
    email: 'orders@techpro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Boulevard, Silicon Valley, CA 94025',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Global Hardware Inc.',
    email: 'sales@globalhardware.com',
    phone: '+1 (555) 987-6543',
    address: '456 Industrial Park, Detroit, MI 48201',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Office Essentials Co.',
    email: 'supply@officeessentials.com',
    phone: '+1 (555) 456-7890',
    address: '789 Commerce Street, New York, NY 10001',
    createdAt: new Date('2024-03-10'),
  },
];

const sampleItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Wireless Keyboard',
    sku: 'KB-WL-001',
    category: 'Electronics',
    quantity: 45,
    minQuantity: 10,
    price: 79.99,
    supplierId: '1',
    supplierName: 'TechPro Supplies',
    description: 'Ergonomic wireless keyboard with backlit keys',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: '2',
    name: 'USB-C Hub',
    sku: 'HB-UC-002',
    category: 'Electronics',
    quantity: 8,
    minQuantity: 15,
    price: 49.99,
    supplierId: '1',
    supplierName: 'TechPro Supplies',
    description: '7-in-1 USB-C hub with HDMI and card reader',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '3',
    name: 'Office Chair',
    sku: 'CH-OF-003',
    category: 'Furniture',
    quantity: 0,
    minQuantity: 5,
    price: 299.99,
    supplierId: '2',
    supplierName: 'Global Hardware Inc.',
    description: 'Ergonomic mesh office chair with lumbar support',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-06-18'),
  },
  {
    id: '4',
    name: 'Printer Paper (A4)',
    sku: 'PP-A4-004',
    category: 'Office Supplies',
    quantity: 120,
    minQuantity: 50,
    price: 24.99,
    supplierId: '3',
    supplierName: 'Office Essentials Co.',
    description: '500 sheets per ream, 80gsm white paper',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-06-22'),
  },
  {
    id: '5',
    name: 'Standing Desk',
    sku: 'DK-ST-005',
    category: 'Furniture',
    quantity: 12,
    minQuantity: 3,
    price: 599.99,
    supplierId: '2',
    supplierName: 'Global Hardware Inc.',
    description: 'Electric height-adjustable standing desk',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-06-25'),
  },
];

export const useInventoryStore = create<InventoryState>((set) => ({
  items: sampleItems,
  suppliers: sampleSuppliers,

  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date() } : item
      ),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  adjustQuantity: (id, adjustment) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + adjustment),
              updatedAt: new Date(),
            }
          : item
      ),
    })),

  addSupplier: (supplier) =>
    set((state) => ({
      suppliers: [
        ...state.suppliers,
        {
          ...supplier,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        },
      ],
    })),

  deleteSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((supplier) => supplier.id !== id),
      // Also remove supplier reference from items
      items: state.items.map((item) =>
        item.supplierId === id
          ? { ...item, supplierId: '', supplierName: 'Unknown' }
          : item
      ),
    })),
}));
