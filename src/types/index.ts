export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'acoustic' | 'electric' | 'bass' | 'accessories';
  price: number;
  stock: number;
  minStockThreshold: number;
  image?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentType: 'cash' | 'gcash';
  cashierName: string;
}

export interface User {
  username: string;
  passwordHash: string;
  name: string;
  role: 'admin';
}

export interface AppSettings {
  storeName: string;
  storeAddress: string;
  defaultLowStockThreshold: number;
}
