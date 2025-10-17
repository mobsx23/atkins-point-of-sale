import { Product, Transaction, User, AppSettings } from '@/types';

const STORAGE_KEYS = {
  PRODUCTS: 'atkins_products',
  TRANSACTIONS: 'atkins_transactions',
  USERS: 'atkins_users',
  SETTINGS: 'atkins_settings',
  AUTH: 'atkins_auth',
};

// Simple hash function for demo purposes (NOT secure for production)
export const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

// Products
export const getProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const addProduct = (product: Product): void => {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
};

export const updateProduct = (id: string, updates: Partial<Product>): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
  }
};

export const deleteProduct = (id: string): void => {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
};

// Transactions
export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

// Users
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// Settings
export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    storeName: 'Atkins Guitar Store',
    storeAddress: '123 Music Street, Harmony City',
    defaultLowStockThreshold: 5,
  };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Auth
export const getAuthUser = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH);
};

export const setAuthUser = (username: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH, username);
};

export const clearAuthUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};

// Backup & Restore
export const exportData = () => {
  return {
    products: getProducts(),
    transactions: getTransactions(),
    users: getUsers(),
    settings: getSettings(),
    exportDate: new Date().toISOString(),
  };
};

export const importData = (data: any): void => {
  if (data.products) saveProducts(data.products);
  if (data.transactions) saveTransactions(data.transactions);
  if (data.users) saveUsers(data.users);
  if (data.settings) saveSettings(data.settings);
};

// Initialize demo data
export const initializeDemoData = (): void => {
  // Check if data already exists
  if (getProducts().length > 0) return;

  // Demo admin user (username: admin, password: admin123)
  const demoUsers: User[] = [
    {
      username: 'admin',
      passwordHash: simpleHash('admin123'),
      name: 'Store Admin',
      role: 'admin',
    },
  ];
  saveUsers(demoUsers);

  // Demo products
  const demoProducts: Product[] = [
    {
      id: '1',
      name: 'Stratocaster Classic',
      brand: 'Fender',
      category: 'electric',
      price: 45000,
      stock: 8,
      minStockThreshold: 3,
      description: 'Classic electric guitar with vintage tone',
    },
    {
      id: '2',
      name: 'Les Paul Standard',
      brand: 'Gibson',
      category: 'electric',
      price: 89000,
      stock: 4,
      minStockThreshold: 2,
      description: 'Iconic rock guitar with rich sustain',
    },
    {
      id: '3',
      name: 'Dreadnought D-28',
      brand: 'Martin',
      category: 'acoustic',
      price: 125000,
      stock: 6,
      minStockThreshold: 2,
      description: 'Premium acoustic with warm tone',
    },
    {
      id: '4',
      name: 'Jazz Bass',
      brand: 'Fender',
      category: 'bass',
      price: 52000,
      stock: 5,
      minStockThreshold: 2,
      description: 'Versatile bass guitar for any genre',
    },
    {
      id: '5',
      name: 'Classical GC Series',
      brand: 'Yamaha',
      category: 'acoustic',
      price: 18000,
      stock: 12,
      minStockThreshold: 5,
      description: 'Excellent classical guitar for students',
    },
    {
      id: '6',
      name: 'Precision Bass',
      brand: 'Fender',
      category: 'bass',
      price: 48000,
      stock: 3,
      minStockThreshold: 2,
      description: 'The original bass sound',
    },
    {
      id: '7',
      name: 'Telecaster Deluxe',
      brand: 'Fender',
      category: 'electric',
      price: 55000,
      stock: 2,
      minStockThreshold: 3,
      description: 'Twangy classic with modern features',
    },
    {
      id: '8',
      name: 'Guitar Strings Set',
      brand: 'Ernie Ball',
      category: 'accessories',
      price: 450,
      stock: 50,
      minStockThreshold: 20,
      description: 'Premium guitar strings',
    },
  ];
  saveProducts(demoProducts);

  // Demo transactions
  const demoTransactions: Transaction[] = [
    {
      id: 'TXN-001',
      date: new Date(Date.now() - 86400000).toISOString(),
      items: [
        { product: demoProducts[0], quantity: 1 },
        { product: demoProducts[7], quantity: 2 },
      ],
      total: 45900,
      paymentType: 'cash',
      cashierName: 'Store Admin',
    },
    {
      id: 'TXN-002',
      date: new Date(Date.now() - 172800000).toISOString(),
      items: [{ product: demoProducts[4], quantity: 1 }],
      total: 18000,
      paymentType: 'gcash',
      cashierName: 'Store Admin',
    },
  ];
  saveTransactions(demoTransactions);
};
