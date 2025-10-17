import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';
import { getProducts, saveProducts, addProduct as addProductToStorage, updateProduct as updateProductInStorage, deleteProduct as deleteProductFromStorage } from '@/lib/storage';

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
  refreshProducts: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const refreshProducts = () => {
    setProducts(getProducts());
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = (product: Product) => {
    addProductToStorage(product);
    refreshProducts();
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    updateProductInStorage(id, updates);
    refreshProducts();
  };

  const deleteProduct = (id: string) => {
    deleteProductFromStorage(id);
    refreshProducts();
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.minStockThreshold);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getLowStockProducts,
        refreshProducts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};
