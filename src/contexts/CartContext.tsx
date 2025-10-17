import React, { createContext, useContext, useState } from 'react';
import { CartItem, Product, Transaction } from '@/types';
import { addTransaction, updateProduct } from '@/lib/storage';
import { useInventory } from './InventoryContext';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  checkout: (paymentType: 'cash' | 'gcash') => Transaction | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { refreshProducts } = useInventory();
  const { user } = useAuth();

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const checkout = (paymentType: 'cash' | 'gcash'): Transaction | null => {
    if (cart.length === 0) return null;

    // Check stock availability
    for (const item of cart) {
      if (item.product.stock < item.quantity) {
        return null;
      }
    }

    // Create transaction
    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: getTotal(),
      paymentType,
      cashierName: user?.name || 'Unknown',
    };

    // Update inventory
    cart.forEach(item => {
      updateProduct(item.product.id, {
        stock: item.product.stock - item.quantity,
      });
    });

    // Save transaction
    addTransaction(transaction);

    // Refresh products and clear cart
    refreshProducts();
    clearCart();

    return transaction;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
