import { create } from 'zustand';
import { InventoryItem, Supplier, ItemIssue, ItemAddition } from '@/types/inventory';
import { itemsApi, suppliersApi, itemAdditionsApi, itemIssuesApi } from '@/services/api';

type UserRole = 'storekeeper' | 'admin';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface InventoryState {
  items: InventoryItem[];
  suppliers: Supplier[];
  issues: ItemIssue[];
  additions: ItemAddition[];
  isAuthenticated: boolean;
  currentUser: User | null;
  fetchItems: () => Promise<void>;
  fetchSuppliers: () => Promise<void>;
  fetchAdditions: () => Promise<void>;
  fetchIssues: () => Promise<void>;
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  adjustQuantity: (id: string, adjustment: number) => void;
  updateItemQuantity: (id: string, quantityToAdd: number, notes?: string) => void;
  issueItem: (itemId: string, quantity: number, reason: string, issuedTo: string, notes: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  deleteSupplier: (id: string) => void;
  login: (email: string, password: string) => boolean;
  createEmployee: (fullName: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
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
    name: 'Full Kit – L',
    sku: 'FK-L-001',
    category: 'Wear Items',
    quantity: 25,
    minQuantity: 5,
    price: 2500.00,
    supplierId: '1',
    supplierName: 'TechPro Supplies',
    description: 'Full funeral kit size L',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: '2',
    name: 'Saree – XL',
    sku: 'SR-XL-002',
    category: 'Wear Items',
    quantity: 18,
    minQuantity: 5,
    price: 1800.00,
    supplierId: '1',
    supplierName: 'TechPro Supplies',
    description: 'Traditional saree size XL',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-06-20'),
  },
  {
    id: '3',
    name: 'Pant Shirt – M',
    sku: 'PS-M-003',
    category: 'Wear Items',
    quantity: 12,
    minQuantity: 5,
    price: 1500.00,
    supplierId: '2',
    supplierName: 'Global Hardware Inc.',
    description: 'Pant and shirt combo size M',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-06-18'),
  },
  {
    id: '4',
    name: 'Satin – Silver',
    sku: 'ST-SV-004',
    category: 'Casket Items',
    quantity: 35,
    minQuantity: 10,
    price: 3500.00,
    supplierId: '3',
    supplierName: 'Office Essentials Co.',
    description: 'Silver satin casket lining',
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-06-22'),
  },
  {
    id: '5',
    name: 'Sil Dress – S',
    sku: 'SD-S-005',
    category: 'Wear Items',
    quantity: 20,
    minQuantity: 5,
    price: 1200.00,
    supplierId: '2',
    supplierName: 'Global Hardware Inc.',
    description: 'Sil dress size S',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-06-25'),
  },
  {
    id: '6',
    name: 'Cotton Rolls',
    sku: 'CR-001-006',
    category: 'Embalming Items',
    quantity: 50,
    minQuantity: 20,
    price: 450.00,
    supplierId: '1',
    supplierName: 'TechPro Supplies',
    description: 'High quality cotton rolls for embalming',
    createdAt: new Date('2024-05-10'),
    updatedAt: new Date('2024-06-26'),
  },
  {
    id: '7',
    name: 'Bar Set – Design',
    sku: 'BS-DG-007',
    category: 'Casket Items',
    quantity: 15,
    minQuantity: 5,
    price: 2200.00,
    supplierId: '3',
    supplierName: 'Office Essentials Co.',
    description: 'Designer casket bar set',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-06-27'),
  },
  {
    id: '8',
    name: 'Osari – XXL',
    sku: 'OS-XXL-008',
    category: 'Wear Items',
    quantity: 8,
    minQuantity: 3,
    price: 1600.00,
    supplierId: '1',
    supplierName: 'TechPro Supplies',
    description: 'Osari size XXL',
    createdAt: new Date('2024-05-20'),
    updatedAt: new Date('2024-06-28'),
  },
  {
    id: '9',
    name: 'Cotton Gloves',
    sku: 'CG-001-009',
    category: 'Embalming Items',
    quantity: 40,
    minQuantity: 15,
    price: 250.00,
    supplierId: '2',
    supplierName: 'Global Hardware Inc.',
    description: 'Sterile cotton gloves per pack',
    createdAt: new Date('2024-05-25'),
    updatedAt: new Date('2024-06-29'),
  },
  {
    id: '10',
    name: 'Casket Hooks',
    sku: 'CH-001-010',
    category: 'Casket Items',
    quantity: 60,
    minQuantity: 20,
    price: 800.00,
    supplierId: '3',
    supplierName: 'Office Essentials Co.',
    description: 'Premium casket hooks set',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-30'),
  },
];

// Predefined accounts
const predefinedAccounts: Array<User & { password: string }> = [
  {
    id: '1',
    fullName: 'Admin User',
    email: 'admin1@sfd.com',
    password: 'Admin111_',
    role: 'admin',
  },
  {
    id: '2',
    fullName: 'Store Keeper',
    email: 'storekeeper1@sfd.com',
    password: 'StoreKeeper111',
    role: 'storekeeper',
  },
];

// Try to restore user from localStorage
const savedUser = (() => {
  try {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
})();

export const useInventoryStore = create<InventoryState>((set) => ({
  items: sampleItems,
  suppliers: sampleSuppliers,
  issues: [],
  additions: [],
  isAuthenticated: !!savedUser,
  currentUser: savedUser,

  fetchItems: async () => {
    try {
      const items = await itemsApi.getAllItems();
      if (items && Array.isArray(items)) {
        set({ items: items.map((item: any) => ({
          id: item.id ? item.id.toString() : crypto.randomUUID(),
          name: item.name,
          sku: item.sku,
          category: item.category,
          quantity: item.quantity,
          minQuantity: item.minQuantity,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          supplierId: item.supplierId ? item.supplierId.toString() : '',
          supplierName: item.supplierName || '',
          description: item.description || '',
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })) });
      }
    } catch (error) {
      console.error('Failed to fetch items from backend:', error);
      // Keep existing items if fetch fails
    }
  },

  fetchSuppliers: async () => {
    try {
      const suppliers = await suppliersApi.getAllSuppliers();
      if (suppliers && Array.isArray(suppliers)) {
        set({ suppliers: suppliers.map((supplier: any) => ({
          id: supplier.id ? supplier.id.toString() : crypto.randomUUID(),
          name: supplier.name,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          createdAt: new Date(supplier.createdAt),
        })) });
      }
    } catch (error) {
      console.error('Failed to fetch suppliers from backend:', error);
      // Keep existing suppliers if fetch fails
    }
  },

  fetchAdditions: async () => {
    try {
      const additions = await itemAdditionsApi.getAllAdditions();
      if (additions && Array.isArray(additions)) {
        set({ additions: additions.map((addition: any) => ({
          id: addition.id ? addition.id.toString() : crypto.randomUUID(),
          itemId: addition.itemId ? addition.itemId.toString() : '',
          itemName: addition.itemName || '',
          quantity: addition.quantity || 0,
          supplierId: addition.supplierId ? addition.supplierId.toString() : '',
          supplierName: addition.supplierName || '',
          notes: addition.notes || '',
          addedAt: new Date(addition.addedAt || new Date()),
        })) });
      }
    } catch (error) {
      console.error('Failed to fetch additions from backend:', error);
      // Keep existing additions if fetch fails
    }
  },

  fetchIssues: async () => {
    try {
      const issues = await itemIssuesApi.getAllIssues();
      if (issues && Array.isArray(issues)) {
        set({ issues: issues.map((issue: any) => ({
          id: issue.id ? issue.id.toString() : crypto.randomUUID(),
          itemId: issue.itemId ? issue.itemId.toString() : '',
          itemName: issue.itemName || '',
          quantity: issue.quantity || 0,
          reason: issue.reason || '',
          issuedTo: issue.issuedTo || '',
          notes: issue.notes || '',
          issuedAt: new Date(issue.issuedAt || new Date()),
        })) });
      }
    } catch (error) {
      console.error('Failed to fetch issues from backend:', error);
      // Keep existing issues if fetch fails
    }
  },

  addItem: (item) =>
    set((state) => {
      const newItem = {
        ...item,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        items: [...state.items, newItem],
        additions: [
          ...state.additions,
          {
            id: crypto.randomUUID(),
            itemId: newItem.id,
            itemName: item.name,
            quantity: item.quantity,
            supplierId: item.supplierId,
            supplierName: item.supplierName,
            notes: `Item added to inventory`,
            addedAt: new Date(),
          },
        ],
      };
    }),

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

  updateItemQuantity: (id, quantityToAdd, notes = '') =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;

      return {
        items: state.items.map((i) =>
          i.id === id
            ? {
                ...i,
                quantity: i.quantity + quantityToAdd,
                updatedAt: new Date(),
              }
            : i
        ),
        additions: [
          ...state.additions,
          {
            id: crypto.randomUUID(),
            itemId: id,
            itemName: item.name,
            quantity: quantityToAdd,
            supplierId: item.supplierId,
            supplierName: item.supplierName,
            notes: notes,
            addedAt: new Date(),
          },
        ],
      };
    }),

  issueItem: (itemId, quantity, reason, issuedTo, notes) =>
    set((state) => {
      const item = state.items.find((i) => i.id === itemId);
      if (!item) return state;

      return {
        items: state.items.map((i) =>
          i.id === itemId
            ? {
                ...i,
                quantity: Math.max(0, i.quantity - quantity),
                updatedAt: new Date(),
              }
            : i
        ),
        issues: [
          ...state.issues,
          {
            id: crypto.randomUUID(),
            itemId,
            itemName: item.name,
            quantity,
            reason,
            issuedTo,
            notes,
            issuedAt: new Date(),
          },
        ],
      };
    }),

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

  login: (email: string, password: string) => {
    // Validate against predefined accounts
    const account = predefinedAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (account) {
      const user: User = {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        role: account.role,
      };
      set({ isAuthenticated: true, currentUser: user });
      // Store in localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(user));
      return true;
    }
    return false;
  },

  createEmployee: (fullName: string, email: string, password: string, role: UserRole) => {
    // Get current state from the store
    const state = useInventoryStore.getState();
    if (!state || !state.currentUser || state.currentUser.role !== 'admin') {
      return false;
    }

    // Check if email already exists
    if (predefinedAccounts.some((acc) => acc.email === email)) {
      return false;
    }

    // Add new account to predefined accounts
    const newAccount: User & { password: string } = {
      id: Math.random().toString(36).substr(2, 9),
      fullName,
      email,
      password,
      role,
    };

    predefinedAccounts.push(newAccount);
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false, currentUser: null });
    localStorage.removeItem('auth_user');
  },
}));
