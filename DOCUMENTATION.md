# Atkins Guitar Store - POS System Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technical Stack](#technical-stack)
5. [Project Structure](#project-structure)
6. [Data Models](#data-models)
7. [State Management](#state-management)
8. [Component Documentation](#component-documentation)
9. [Page Documentation](#page-documentation)
10. [Styling & Design System](#styling--design-system)
11. [Data Persistence](#data-persistence)
12. [Offline Functionality](#offline-functionality)
13. [Printing System](#printing-system)
14. [Development Guide](#development-guide)
15. [Security Considerations](#security-considerations)

---

## Project Overview

Atkins Guitar Store POS is a **frontend-only** Point of Sale web application built with React.js. It's designed to run locally without any server or cloud integration, making it perfect for offline use. All data is persisted locally using browser localStorage.

### Key Characteristics
- **100% Frontend**: No backend server required
- **Offline-First**: Works completely offline with service worker caching
- **Local Persistence**: All data stored in browser localStorage
- **Demo-Ready**: Comes pre-loaded with sample data
- **Print-Friendly**: Built-in receipt and report printing

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Router (Navigation)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Context Providers                      │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐  │ │
│  │  │    Auth      │ │  Inventory   │ │     Cart     │  │ │
│  │  │   Context    │ │   Context    │ │   Context    │  │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Page Components                       │ │
│  │  Login | Dashboard | POS | Inventory | Transactions    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌──────────────────┐
                    │   localStorage   │
                    │   (Persistence)  │
                    └──────────────────┘
```

### Data Flow

1. **Authentication Flow**
   - User enters credentials → AuthContext validates → Sets user session → Navigate to dashboard

2. **Inventory Management Flow**
   - Admin adds/edits product → InventoryContext updates → Saves to localStorage → UI refreshes

3. **Sales Flow**
   - Select products → Add to cart (CartContext) → Checkout → Decrease inventory → Save transaction → Print receipt

---

## Features

### 1. Authentication (Simulated)
- Local admin login with username/password
- Session persistence in localStorage
- Protected routes requiring authentication
- Demo credentials: `admin` / `admin123`

### 2. Inventory Management
- Full CRUD operations for products
- Real-time stock tracking
- Low-stock alerts and indicators
- Configurable stock thresholds
- Product categories: Acoustic, Electric, Bass, Accessories
- Visual indicators for stock levels

### 3. Point of Sale (POS)
- Product search and filtering
- Quick-add to cart functionality
- Quantity adjustment controls
- Real-time cart total calculation
- Payment type selection (Cash/GCash)
- Automatic inventory deduction on checkout
- Receipt generation and printing

### 4. Transaction Management
- Complete transaction history
- Date range filtering
- Payment type filtering
- Transaction detail view
- Receipt reprinting capability

### 5. Reports & Analytics
- Sales summary with revenue metrics
- Transaction count and average sale value
- Top-selling products analysis
- Low-stock inventory alerts
- Configurable date range reporting
- CSV export functionality

### 6. Data Management
- Manual backup (JSON export)
- Data restore (JSON import)
- Reset to demo data
- Import/export validation

### 7. Settings
- Store information management
- Low-stock threshold configuration
- Data backup and restore interface

---

## Technical Stack

### Core Technologies
- **Framework**: React 18.3.1
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM 6.30.1
- **State Management**: React Context API

### UI & Styling
- **CSS Framework**: Tailwind CSS
- **Component Library**: Radix UI primitives
- **Icons**: Lucide React
- **Styling Utilities**: class-variance-authority, clsx, tailwind-merge

### Data & Forms
- **Form Handling**: React Hook Form 7.61.1
- **Validation**: Zod 3.25.76
- **Date Handling**: date-fns 3.6.0

### Features
- **Printing**: react-to-print 3.2.0
- **Charts**: Recharts 2.15.4
- **Notifications**: Sonner 1.7.4
- **Theming**: next-themes 0.3.0

### Offline & PWA
- **Service Worker**: Custom implementation
- **Caching**: App shell and static assets

---

## Project Structure

```
atkins-guitar-store/
├── public/
│   ├── robots.txt
│   └── service-worker.js          # Offline functionality
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn/ui components
│   │   ├── Layout.tsx             # Main app layout with sidebar
│   │   ├── ProtectedRoute.tsx    # Route authentication wrapper
│   │   └── ReceiptPrint.tsx       # Printable receipt component
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Authentication state
│   │   ├── CartContext.tsx        # Shopping cart state
│   │   └── InventoryContext.tsx   # Product inventory state
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Mobile detection hook
│   │   └── use-toast.ts           # Toast notification hook
│   ├── lib/
│   │   ├── storage.ts             # localStorage utilities
│   │   └── utils.ts               # General utilities
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main dashboard with stats
│   │   ├── Inventory.tsx          # Product management
│   │   ├── Login.tsx              # Authentication page
│   │   ├── NotFound.tsx           # 404 page
│   │   ├── POS.tsx                # Point of sale interface
│   │   ├── Reports.tsx            # Sales and inventory reports
│   │   ├── Settings.tsx           # App settings
│   │   └── Transactions.tsx       # Transaction history
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── App.tsx                    # Main app component
│   ├── index.css                  # Global styles & design tokens
│   └── main.tsx                   # App entry point
├── index.html
├── tailwind.config.ts             # Tailwind configuration
├── vite.config.ts                 # Vite configuration
└── package.json
```

---

## Data Models

### Product Interface
```typescript
interface Product {
  id: string;              // Unique identifier
  name: string;            // Product name
  brand: string;           // Manufacturer/brand
  category: 'acoustic' | 'electric' | 'bass' | 'accessories';
  price: number;           // Unit price in PHP
  stock: number;           // Current inventory count
  minStockThreshold: number; // Low-stock alert threshold
  image?: string;          // Optional product image URL
  description?: string;    // Optional product description
}
```

### CartItem Interface
```typescript
interface CartItem {
  product: Product;        // Product reference
  quantity: number;        // Quantity in cart
}
```

### Transaction Interface
```typescript
interface Transaction {
  id: string;              // Unique transaction ID
  date: string;            // ISO timestamp
  items: CartItem[];       // Purchased items
  total: number;           // Total amount
  paymentType: 'cash' | 'gcash';
  cashierName: string;     // Name of cashier
}
```

### User Interface
```typescript
interface User {
  username: string;        // Login username
  passwordHash: string;    // Hashed password
  name: string;            // Display name
  role: 'admin';           // User role (admin only)
}
```

### AppSettings Interface
```typescript
interface AppSettings {
  storeName: string;               // Store name for receipts
  storeAddress: string;            // Store address for receipts
  defaultLowStockThreshold: number; // Default threshold for new products
}
```

---

## State Management

### AuthContext

**Purpose**: Manages user authentication and session state.

**State**:
- `user: User | null` - Current authenticated user

**Methods**:
- `login(username: string, password: string): boolean` - Authenticate user
- `logout(): void` - Clear session and logout
- `isAuthenticated: boolean` - Authentication status

**Usage**:
```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

### InventoryContext

**Purpose**: Manages product inventory and CRUD operations.

**State**:
- `products: Product[]` - All products in inventory

**Methods**:
- `addProduct(product: Product): void` - Add new product
- `updateProduct(id: string, updates: Partial<Product>): void` - Update product
- `deleteProduct(id: string): void` - Remove product
- `getProductById(id: string): Product | undefined` - Find product by ID
- `getLowStockProducts(): Product[]` - Get products below threshold
- `refreshProducts(): void` - Reload from storage

**Usage**:
```typescript
const { products, addProduct, updateProduct, deleteProduct } = useInventory();
```

### CartContext

**Purpose**: Manages shopping cart state and checkout process.

**State**:
- `cart: CartItem[]` - Current cart items

**Methods**:
- `addToCart(product: Product, quantity?: number): void` - Add item to cart
- `removeFromCart(productId: string): void` - Remove item from cart
- `updateQuantity(productId: string, quantity: number): void` - Update item quantity
- `clearCart(): void` - Empty the cart
- `getTotal(): number` - Calculate cart total
- `checkout(paymentType: 'cash' | 'gcash'): Transaction | null` - Process sale

**Usage**:
```typescript
const { cart, addToCart, checkout, getTotal } = useCart();
```

---

## Component Documentation

### Layout Component
**File**: `src/components/Layout.tsx`

Main application layout with sidebar navigation and user info display.

**Features**:
- Responsive sidebar with navigation links
- Active route highlighting
- User profile display
- Logout functionality
- Mobile-friendly collapsible sidebar

### ProtectedRoute Component
**File**: `src/components/ProtectedRoute.tsx`

Route wrapper that enforces authentication.

**Behavior**:
- Checks authentication status via AuthContext
- Redirects to `/login` if not authenticated
- Renders protected content if authenticated

**Usage**:
```typescript
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

### ReceiptPrint Component
**File**: `src/components/ReceiptPrint.tsx`

Printable receipt template for transactions.

**Props**:
- `transaction: Transaction` - Transaction data to print

**Features**:
- Store information header
- Itemized list with quantities and prices
- Total calculation
- Payment type and cashier name
- Transaction ID and timestamp
- Print-optimized styling

---

## Page Documentation

### Login Page
**Route**: `/login`  
**File**: `src/pages/Login.tsx`

**Features**:
- Username and password input fields
- Form validation
- Error handling with toast notifications
- Redirects to dashboard on success
- Demo credentials display

### Dashboard Page
**Route**: `/dashboard`  
**File**: `src/pages/Dashboard.tsx`

**Features**:
- Today's sales summary with peso icon
- Total transaction count
- Low stock alerts count
- Recent transactions list (last 5)
- Low stock products list
- Quick action buttons

### POS (Point of Sale) Page
**Route**: `/pos`  
**File**: `src/pages/POS.tsx`

**Features**:
- Product search and filtering
- Product grid with category badges
- Stock level indicators
- Add to cart with yellow button design
- Cart management (quantity adjust, remove)
- Real-time total calculation
- Payment type selection (Cash/GCash)
- Checkout with receipt printing
- Low stock warnings during checkout

### Inventory Page
**Route**: `/inventory`  
**File**: `src/pages/Inventory.tsx`

**Features**:
- Product list with stock indicators
- Low stock visual warnings
- Add new product form
- Edit product dialog
- Delete product with confirmation
- Category filtering
- Responsive table layout

### Transactions Page
**Route**: `/transactions`  
**File**: `src/pages/Transactions.tsx`

**Features**:
- Transaction history table
- Date range filtering
- Payment type filtering
- Transaction detail view
- Reprint receipt functionality
- Expandable transaction rows
- Total amount display

### Reports Page
**Route**: `/reports`  
**File**: `src/pages/Reports.tsx`

**Features**:
- Configurable date range selection
- Sales summary metrics
- Top-selling products chart
- Low stock inventory alerts
- Export to CSV functionality
- Revenue trends visualization

### Settings Page
**Route**: `/settings`  
**File**: `src/pages/Settings.tsx`

**Features**:
- Store information management
- Low stock threshold configuration
- Data export (JSON download)
- Data import (JSON upload)
- Reset to demo data
- Form validation
- Success/error notifications

---

## Styling & Design System

### Design Philosophy
The app uses a warm, music-inspired design with a palette of deep burgundy, warm amber, and brass gold accents.

### Color Tokens (HSL)
Defined in `src/index.css`:

```css
:root {
  --background: 0 0% 100%;           /* White background */
  --foreground: 222 25% 12%;         /* Dark navy text */
  --primary: 358 75% 35%;            /* Deep burgundy */
  --primary-foreground: 0 0% 98%;    /* White on primary */
  --accent: 45 100% 52%;             /* Warm amber/gold */
  --accent-foreground: 222 25% 12%;  /* Dark text on accent */
  --warning: 25 95% 53%;             /* Orange for alerts */
  --sidebar: 222 40% 15%;            /* Dark sidebar */
  --sidebar-foreground: 0 0% 98%;    /* Light text on sidebar */
  /* ... additional tokens ... */
}
```

### Design Principles
1. **Semantic Tokens**: Always use CSS variables, never hardcoded colors
2. **HSL Format**: All colors defined in HSL for consistency
3. **Dark Mode Support**: Full dark mode theme included
4. **Consistent Spacing**: Tailwind's spacing scale
5. **Responsive Design**: Mobile-first approach
6. **Accessibility**: WCAG 2.1 AA contrast ratios

### Component Variants
Custom button and card variants defined using class-variance-authority for consistent UI patterns.

---

## Data Persistence

### Storage Keys
```typescript
const STORAGE_KEYS = {
  PRODUCTS: 'atkins_products',
  TRANSACTIONS: 'atkins_transactions',
  USERS: 'atkins_users',
  SETTINGS: 'atkins_settings',
  AUTH_USER: 'atkins_auth_user',
};
```

### Storage Functions
All data persistence handled through `src/lib/storage.ts`:

#### Product Operations
- `getProducts()`: Retrieve all products
- `saveProducts(products)`: Save product array
- `addProduct(product)`: Add single product
- `updateProduct(id, updates)`: Update product fields
- `deleteProduct(id)`: Remove product

#### Transaction Operations
- `getTransactions()`: Retrieve all transactions
- `saveTransactions(transactions)`: Save transactions
- `addTransaction(transaction)`: Add new transaction

#### Settings Operations
- `getSettings()`: Get app settings with defaults
- `saveSettings(settings)`: Save settings

#### Auth Operations
- `getAuthUser()`: Get current username
- `setAuthUser(username)`: Set logged-in user
- `clearAuthUser()`: Remove session

#### Backup Operations
- `exportData()`: Export all data as JSON
- `importData(data)`: Import and restore data

### Data Initialization
`initializeDemoData()` automatically seeds:
- 1 demo admin user
- 20 sample guitar products
- 3 sample transactions

---

## Offline Functionality

### Service Worker
**File**: `public/service-worker.js`

**Features**:
- App shell caching
- Static asset caching
- Offline fallback
- Cache-first strategy for assets

**Registration**:
```typescript
// src/main.tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

**Cached Resources**:
- HTML files
- JavaScript bundles
- CSS files
- Images and fonts

### Offline Behavior
- App loads instantly from cache when offline
- All features work without internet connection
- Data persists in localStorage
- No network requests required

---

## Printing System

### Implementation
Uses `react-to-print` library for printing receipts and reports.

### Receipt Printing
```typescript
import { useReactToPrint } from 'react-to-print';

const handlePrint = useReactToPrint({
  contentRef: receiptRef,
  documentTitle: `Receipt-${transaction.id}`,
});
```

### Print Styles
- Print-optimized CSS (`@media print`)
- Removes unnecessary UI elements
- Black and white color scheme
- Proper page breaks
- Consistent formatting

### What Can Be Printed
1. **Transaction Receipts**: Individual sale receipts with itemized details
2. **Reports**: Sales summaries and inventory reports
3. **Export as PDF**: Via browser's print-to-PDF feature

---

## Development Guide

### Getting Started

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Build for Production**
```bash
npm run build
```

4. **Preview Production Build**
```bash
npm run preview
```

### Environment Setup
No environment variables required - this is a frontend-only app.

### Demo Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Adding New Features

#### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx`
4. Wrap with `ProtectedRoute` if authentication required

#### Adding New Product Category
1. Update `Product` interface in `src/types/index.ts`
2. Update category logic in relevant components
3. Add category to demo data in `src/lib/storage.ts`

#### Modifying Storage Schema
1. Update interfaces in `src/types/index.ts`
2. Update storage functions in `src/lib/storage.ts`
3. Update demo data initialization
4. Consider data migration for existing users

### Testing
Basic testing recommendations:
- Test add to cart flow
- Test checkout process
- Test inventory updates
- Test data export/import
- Test offline functionality
- Test printing

---

## Security Considerations

### ⚠️ Important Security Notes

This is a **demo/prototype application** with simulated security. **DO NOT use in production without proper security implementation.**

### Current Limitations
1. **Password Hashing**: Uses simple hash (NOT cryptographically secure)
2. **No Encryption**: Data stored in plain text in localStorage
3. **Client-Side Only**: No server-side validation
4. **Session Management**: Basic localStorage-based sessions
5. **No HTTPS Enforcement**: Requires manual HTTPS setup

### Production Recommendations
If deploying to production:
1. Implement proper backend authentication
2. Use bcrypt or similar for password hashing
3. Add JWT tokens or session-based auth
4. Encrypt sensitive data
5. Implement rate limiting
6. Add audit logging
7. Use HTTPS exclusively
8. Add input sanitization
9. Implement CSRF protection
10. Add role-based access control

### Data Privacy
- All data stored locally in browser
- No data transmitted to external servers
- User responsible for data backups
- Clearing browser data will delete all app data

---

## Troubleshooting

### Common Issues

**Issue**: Data lost after browser restart  
**Solution**: Ensure localStorage is enabled in browser settings

**Issue**: Receipt not printing  
**Solution**: Check browser print permissions and popup blockers

**Issue**: App not working offline  
**Solution**: Ensure service worker is registered, check console for errors

**Issue**: Cannot login with demo credentials  
**Solution**: Reset demo data in Settings page

**Issue**: Low stock warnings not showing  
**Solution**: Check product `minStockThreshold` values in inventory

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 12.2+)
- IE11: Not supported

### Performance
- Optimized for up to 1000 products
- Handles 10,000+ transactions
- localStorage limit: ~5-10MB per domain
- Consider IndexedDB for larger datasets

---

## Future Enhancements

Potential features for future versions:
1. **Multi-user support** with different permission levels
2. **Customer management** system
3. **Discounts and promotions** engine
4. **Barcode scanning** integration
5. **Email receipts** functionality
6. **Advanced reporting** with charts and trends
7. **Inventory forecasting** and auto-reorder
8. **Multi-store support**
9. **Cloud backup** option
10. **Mobile app** version

---

## Support & Contributions

### Questions?
Refer to README.md for basic setup instructions.

### Reporting Issues
Document issues with:
- Browser version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

### Code Style
- TypeScript for type safety
- Functional components with hooks
- ESLint configuration included
- Consistent naming conventions
- Comments for complex logic

---

## License

This project is a demonstration application for educational purposes.

---

**Last Updated**: 2025-11-17  
**Version**: 1.0.0  
**Author**: Atkins Guitar Store Development Team
