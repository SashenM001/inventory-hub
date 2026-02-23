const API_BASE_URL = 'http://localhost:8082/api/v1';

// Helper function to handle API errors
const handleApiError = (error: unknown, context: string) => {
  if (error instanceof Response) {
    console.error(`${context} - Status: ${error.status}`);
    throw new Error(`${context}: ${error.statusText}`);
  }
  console.error(`${context}:`, error);
  throw error;
};

// Items API
export const itemsApi = {
  // Create a new item
  async createItem(itemData: {
    name: string;
    sku: string;
    category: string;
    quantity: number;
    minQuantity: number;
    price: number;
    supplierId: number | string;
    description?: string;
    unit?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: itemData.name,
          sku: itemData.sku,
          category: itemData.category,
          quantity: itemData.quantity,
          minQuantity: itemData.minQuantity,
          price: parseFloat(itemData.price.toString()),
          supplierId: Number(itemData.supplierId),
          description: itemData.description || '',
          unit: itemData.unit || '',
        }),
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to create item');
    }
  },

  // Get all items
  async getAllItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to fetch items');
    }
  },

  // Get item by ID
  async getItemById(id: number | string) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to fetch item ${id}`);
    }
  },

  // Get items by category
  async getItemsByCategory(category: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/category/${encodeURIComponent(category)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to fetch items by category: ${category}`);
    }
  },

  // Search items
  async searchItems(searchTerm: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/search?searchTerm=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to search items: ${searchTerm}`);
    }
  },

  // Get low stock items
  async getLowStockItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/items/low-stock`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to fetch low stock items');
    }
  },

  // Update item
  async updateItem(id: number | string, itemData: Partial<any>) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to update item ${id}`);
    }
  },

  // Adjust quantity
  async adjustQuantity(id: number | string, adjustment: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}/quantity?adjustment=${adjustment}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return response.ok;
    } catch (error) {
      handleApiError(error, `Failed to adjust quantity for item ${id}`);
    }
  },

  // Delete item
  async deleteItem(id: number | string) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return response.ok;
    } catch (error) {
      handleApiError(error, `Failed to delete item ${id}`);
    }
  },
};

// Suppliers API
export const suppliersApi = {
  // Create a new supplier
  async createSupplier(supplierData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to create supplier');
    }
  },

  // Get all suppliers
  async getAllSuppliers() {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to fetch suppliers');
    }
  },

  // Get supplier by ID
  async getSupplierById(id: number | string) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to fetch supplier ${id}`);
    }
  },

  // Find suppliers by name pattern
  async searchSuppliers(searchTerm: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/search?namePattern=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to search suppliers: ${searchTerm}`);
    }
  },

  // Update supplier
  async updateSupplier(id: number | string, supplierData: Partial<any>) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to update supplier ${id}`);
    }
  },

  // Delete supplier
  async deleteSupplier(id: number | string) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return response.ok;
    } catch (error) {
      handleApiError(error, `Failed to delete supplier ${id}`);
    }
  },
};

// Item Additions API
export const itemAdditionsApi = {
  // Add new item (record the addition)
  async addItem(additionData: {
    itemId: number | string;
    quantity: number;
    supplierId?: number | string;
    notes?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/additions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: Number(additionData.itemId),
          quantity: additionData.quantity,
          supplierId: additionData.supplierId ? Number(additionData.supplierId) : null,
          notes: additionData.notes || '',
        }),
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to add item');
    }
  },

  // Get all additions
  async getAllAdditions() {
    try {
      const response = await fetch(`${API_BASE_URL}/additions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to fetch additions');
    }
  },

  // Get addition by ID
  async getAdditionById(id: number | string) {
    try {
      const response = await fetch(`${API_BASE_URL}/additions/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to fetch addition ${id}`);
    }
  },

  // Get additions by item ID
  async getAdditionsByItem(itemId: number | string) {
    try {
      const response = await fetch(`${API_BASE_URL}/additions/item/${itemId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to fetch additions for item ${itemId}`);
    }
  },

  // Get recent additions
  async getRecentAdditions() {
    try {
      const response = await fetch(`${API_BASE_URL}/additions/recent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to fetch recent additions');
    }
  },
};

// Item Issues API
export const itemIssuesApi = {
  // Issue an item
  async issueItem(issueData: {
    itemId: number | string;
    quantity: number;
    reason: string;
    issuedTo: string;
    notes?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: Number(issueData.itemId),
          quantity: issueData.quantity,
          reason: issueData.reason,
          issuedTo: issueData.issuedTo,
          notes: issueData.notes || '',
        }),
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to issue item');
    }
  },

  // Get all issues
  async getAllIssues() {
    try {
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'Failed to fetch issues');
    }
  },

  // Get issues by item ID
  async getIssuesByItem(itemId: number | string) {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/item/${itemId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, `Failed to fetch issues for item ${itemId}`);
    }
  },
};
